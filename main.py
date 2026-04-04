"""
Blog2Code – FastAPI backend
Run locally:  uvicorn main:app --reload --port 8000
Deploy:       Railway / Render (add a Procfile or start command)
"""

import os, sys, shutil, tempfile, zipfile, asyncio
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# ── Make sure the Blog2Code codes/ directory is importable ──────────────────
BLOG2CODE_ROOT = Path(__file__).parent  # adjust if main.py lives elsewhere
sys.path.insert(0, str(BLOG2CODE_ROOT / "codes"))

from codes.blog_process import process_blog   # 0_blog_process.py  → renamed to blog_process.py
from codes.planning     import plan_repo       # 1_planning.py
from codes.analyzing    import analyze_repo    # 2_analyzing.py
from codes.coding       import generate_code   # 3_coding.py

# ── App setup ───────────────────────────────────────────────────────────────
app = FastAPI(title="Blog2Code API", version="1.0.0")

# Allow your frontend origin (update in production)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health check ────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok"}


# ── Main endpoint ───────────────────────────────────────────────────────────
@app.post("/generate")
async def generate(
    url:  str        = Form(None),
    file: UploadFile = File(None),
):
    """
    Accepts either:
      • url  – a public blog URL
      • file – an uploaded .md or .html file

    Returns a .zip of the generated repository.
    """
    if not url and not file:
        raise HTTPException(400, "Provide either 'url' or 'file'.")

    # ── 1. Write input to a temp dir ─────────────────────────────────────
    tmp = Path(tempfile.mkdtemp())
    try:
        if file:
            suffix = Path(file.filename).suffix or ".md"
            input_path = tmp / f"blog{suffix}"
            input_path.write_bytes(await file.read())
            source = str(input_path)
        else:
            source = url.strip()

        # ── 2. Run the pipeline (each step is blocking – run in thread) ──
        data_dir   = tmp / "data"
        output_dir = tmp / "output"
        data_dir.mkdir(); output_dir.mkdir()

        def run_pipeline():
            # Step 0 – parse blog
            blog_data = process_blog(source, data_dir=str(data_dir))

            # Step 1 – plan repo structure
            plan = plan_repo(blog_data, data_dir=str(data_dir))

            # Step 2 – analyse dependencies
            analysis = analyze_repo(blog_data, plan, data_dir=str(data_dir))

            # Step 3 – generate code files
            generate_code(
                blog_data=blog_data,
                plan=plan,
                analysis=analysis,
                output_dir=str(output_dir),
            )

        await asyncio.get_event_loop().run_in_executor(None, run_pipeline)

        # ── 3. Zip the output directory ──────────────────────────────────
        zip_path = tmp / "repo.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in output_dir.rglob("*"):
                if f.is_file():
                    zf.write(f, f.relative_to(output_dir))

        if not zip_path.exists() or zip_path.stat().st_size == 0:
            raise HTTPException(500, "Code generation produced no files.")

        return FileResponse(
            path=str(zip_path),
            media_type="application/zip",
            filename="generated-repo.zip",
            background=None,          # file is cleaned up after response via finally
        )

    except HTTPException:
        shutil.rmtree(tmp, ignore_errors=True)
        raise
    except Exception as exc:
        shutil.rmtree(tmp, ignore_errors=True)
        raise HTTPException(500, str(exc)) from exc
    # Note: tmp cleanup on success happens after FileResponse is sent.
    # For production, use BackgroundTasks to delete tmp after streaming.

import type { MindMapNode } from './MindMap';

export interface Project { name: string; level: string; }
export interface Resource { name: string; url: string; }

export interface TechStack {
    name: string;
    description: string;
    tags: string[];
    tools: string[];
    projects: Project[];
    resources: Resource[];
    mindmap: MindMapNode[];
}

export const TECH_STACKS: TechStack[] = [
    // ────────────────────────────────────────────────────────────────────────────
    {
        name: "MERN Stack",
        description: "Build modern full-stack web apps using MongoDB, Express, React, and Node.js.",
        tags: ["Full Stack", "JavaScript", "NoSQL"],
        tools: ["VS Code", "Postman", "MongoDB Atlas", "npm / yarn", "Chrome DevTools"],
        projects: [
            { name: "Task Manager App", level: "Beginner" },
            { name: "Social Media API", level: "Intermediate" },
            { name: "E-commerce Platform", level: "Advanced" },
        ],
        resources: [
            { name: "MERN Stack Guide", url: "https://www.mongodb.com/mern-stack" },
            { name: "FullStackOpen", url: "https://fullstackopen.com/en/" },
        ],
        mindmap: [
            {
                label: "Frontend — React",
                children: [
                    {
                        label: "Core Concepts",
                        children: [
                            { label: "JSX & Components", url: "https://react.dev/learn" },
                            { label: "Props & State", url: "https://react.dev/learn/passing-props-to-a-component" },
                            { label: "Hooks (useState, useEffect)", url: "https://react.dev/reference/react" },
                            { label: "Context API", url: "https://react.dev/learn/passing-data-deeply-with-context" },
                        ],
                    },
                    {
                        label: "Routing & Data",
                        children: [
                            { label: "React Router v6", url: "https://reactrouter.com/en/main" },
                            { label: "Axios / Fetch", url: "https://axios-http.com/docs/intro" },
                            { label: "React Query", url: "https://tanstack.com/query/latest" },
                        ],
                    },
                    {
                        label: "Styling",
                        children: [
                            { label: "Tailwind CSS", url: "https://tailwindcss.com/docs" },
                            { label: "CSS Modules", url: "https://github.com/css-modules/css-modules" },
                            { label: "Framer Motion", url: "https://www.framer.com/motion/" },
                        ],
                    },
                ],
            },
            {
                label: "Backend — Node / Express",
                children: [
                    {
                        label: "Node.js Fundamentals",
                        children: [
                            { label: "Modules & npm", url: "https://nodejs.org/en/docs/" },
                            { label: "Event Loop", url: "https://nodejs.org/en/guides/event-loop-timers-and-nexttick" },
                            { label: "Streams & Buffers", url: "https://nodejs.org/api/stream.html" },
                        ],
                    },
                    {
                        label: "Express Framework",
                        children: [
                            { label: "Routing & Middleware", url: "https://expressjs.com/en/guide/routing.html" },
                            { label: "REST API Design", url: "https://restfulapi.net/" },
                            { label: "Error Handling", url: "https://expressjs.com/en/guide/error-handling.html" },
                        ],
                    },
                    {
                        label: "Auth",
                        children: [
                            { label: "JWT Authentication", url: "https://jwt.io/introduction" },
                            { label: "Passport.js", url: "https://www.passportjs.org/" },
                            { label: "bcrypt / hashing", url: "https://www.npmjs.com/package/bcrypt" },
                        ],
                    },
                ],
            },
            {
                label: "Database — MongoDB",
                children: [
                    {
                        label: "MongoDB Basics",
                        children: [
                            { label: "CRUD Operations", url: "https://www.mongodb.com/docs/manual/crud/" },
                            { label: "Aggregation Pipeline", url: "https://www.mongodb.com/docs/manual/aggregation/" },
                            { label: "Indexing", url: "https://www.mongodb.com/docs/manual/indexes/" },
                        ],
                    },
                    {
                        label: "Mongoose ODM",
                        children: [
                            { label: "Schemas & Models", url: "https://mongoosejs.com/docs/guide.html" },
                            { label: "Population & Refs", url: "https://mongoosejs.com/docs/populate.html" },
                            { label: "Validation", url: "https://mongoosejs.com/docs/validation.html" },
                        ],
                    },
                ],
            },
            {
                label: "DevOps & Deployment",
                children: [
                    { label: "Docker Basics", url: "https://docs.docker.com/get-started/" },
                    { label: "Deploy on Render", url: "https://render.com/docs" },
                    { label: "MongoDB Atlas", url: "https://www.mongodb.com/cloud/atlas" },
                    { label: "GitHub Actions CI/CD", url: "https://docs.github.com/en/actions" },
                ],
            },
        ],
    },

    // ────────────────────────────────────────────────────────────────────────────
    {
        name: "Python",
        description: "High-level language for backend, AI/ML, and data science with Django or FastAPI.",
        tags: ["Backend", "AI/ML", "Scalable"],
        tools: ["PyCharm / VS Code", "Pipenv", "PostgreSQL", "Jupyter Notebooks", "Docker"],
        projects: [
            { name: "Blog Engine", level: "Beginner" },
            { name: "Real-time Chat App", level: "Intermediate" },
            { name: "ML Model Deployment API", level: "Advanced" },
        ],
        resources: [
            { name: "Django Documentation", url: "https://docs.djangoproject.com/" },
            { name: "FastAPI Guide", url: "https://fastapi.tiangolo.com/" },
        ],
        mindmap: [
            {
                label: "Python Core",
                children: [
                    {
                        label: "Language Fundamentals",
                        children: [
                            { label: "Syntax & Data Types", url: "https://docs.python.org/3/tutorial/" },
                            { label: "List Comprehensions", url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" },
                            { label: "Decorators", url: "https://realpython.com/primer-on-python-decorators/" },
                            { label: "Generators & Iterators", url: "https://realpython.com/introduction-to-python-generators/" },
                        ],
                    },
                    {
                        label: "OOP",
                        children: [
                            { label: "Classes & Inheritance", url: "https://docs.python.org/3/tutorial/classes.html" },
                            { label: "Dunder Methods", url: "https://realpython.com/python-magic-methods/" },
                            { label: "Abstract Classes", url: "https://docs.python.org/3/library/abc.html" },
                        ],
                    },
                    {
                        label: "Standard Library",
                        children: [
                            { label: "pathlib / os", url: "https://docs.python.org/3/library/pathlib.html" },
                            { label: "asyncio", url: "https://docs.python.org/3/library/asyncio.html" },
                            { label: "typing", url: "https://docs.python.org/3/library/typing.html" },
                        ],
                    },
                ],
            },
            {
                label: "Web Frameworks",
                children: [
                    {
                        label: "Django",
                        children: [
                            { label: "Models & ORM", url: "https://docs.djangoproject.com/en/stable/topics/db/models/" },
                            { label: "Views & Templates", url: "https://docs.djangoproject.com/en/stable/topics/http/views/" },
                            { label: "DRF — Rest APIs", url: "https://www.django-rest-framework.org/" },
                            { label: "Django Auth", url: "https://docs.djangoproject.com/en/stable/topics/auth/" },
                        ],
                    },
                    {
                        label: "FastAPI",
                        children: [
                            { label: "Path Operations", url: "https://fastapi.tiangolo.com/tutorial/first-steps/" },
                            { label: "Pydantic Schemas", url: "https://docs.pydantic.dev/latest/" },
                            { label: "Dependency Injection", url: "https://fastapi.tiangolo.com/tutorial/dependencies/" },
                            { label: "Async Routes", url: "https://fastapi.tiangolo.com/async/" },
                        ],
                    },
                ],
            },
            {
                label: "Database",
                children: [
                    {
                        label: "SQL / PostgreSQL",
                        children: [
                            { label: "SQL Basics", url: "https://www.postgresqltutorial.com/" },
                            { label: "SQLAlchemy ORM", url: "https://docs.sqlalchemy.org/en/20/" },
                            { label: "Alembic Migrations", url: "https://alembic.sqlalchemy.org/en/latest/" },
                        ],
                    },
                ],
            },
            {
                label: "Deployment",
                children: [
                    { label: "Docker & Gunicorn", url: "https://docs.docker.com/samples/django/" },
                    { label: "Railway / Render", url: "https://railway.app/help" },
                    { label: "Celery Task Queue", url: "https://docs.celeryq.dev/en/stable/" },
                    { label: "Redis", url: "https://redis.io/docs/" },
                ],
            },
        ],
    },

    // ────────────────────────────────────────────────────────────────────────────
    {
        name: "Spring Boot",
        description: "Robust Java framework for enterprise-level, production-grade applications.",
        tags: ["Enterprise", "Java", "Backend"],
        tools: ["IntelliJ IDEA", "Maven / Gradle", "MySQL Workbench", "Docker", "Postman"],
        projects: [
            { name: "Inventory Management", level: "Beginner" },
            { name: "Banking API Service", level: "Intermediate" },
            { name: "Microservices Architecture", level: "Advanced" },
        ],
        resources: [
            { name: "Spring Guides", url: "https://spring.io/guides" },
            { name: "Baeldung Java/Spring", url: "https://www.baeldung.com/" },
        ],
        mindmap: [
            {
                label: "Java Core",
                children: [
                    {
                        label: "Fundamentals",
                        children: [
                            { label: "OOP & Interfaces", url: "https://dev.java/learn/oop/" },
                            { label: "Generics", url: "https://dev.java/learn/generics/" },
                            { label: "Collections Framework", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html" },
                            { label: "Streams API", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html" },
                        ],
                    },
                    {
                        label: "Concurrency",
                        children: [
                            { label: "Threads & Executors", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html" },
                            { label: "Virtual Threads", url: "https://openjdk.org/jeps/444" },
                        ],
                    },
                ],
            },
            {
                label: "Spring Framework",
                children: [
                    {
                        label: "Core",
                        children: [
                            { label: "IoC & Dependency Injection", url: "https://docs.spring.io/spring-framework/reference/core/beans.html" },
                            { label: "Spring Boot Auto-config", url: "https://docs.spring.io/spring-boot/reference/using/auto-configuration.html" },
                            { label: "Application Properties", url: "https://docs.spring.io/spring-boot/appendix/application-properties/index.html" },
                        ],
                    },
                    {
                        label: "Web / REST",
                        children: [
                            { label: "Spring MVC & Controllers", url: "https://docs.spring.io/spring-framework/reference/web/webmvc.html" },
                            { label: "Request Mapping", url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html" },
                            { label: "Exception Handling", url: "https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc" },
                        ],
                    },
                    {
                        label: "Data",
                        children: [
                            { label: "Spring Data JPA", url: "https://spring.io/projects/spring-data-jpa" },
                            { label: "Hibernate ORM", url: "https://hibernate.org/orm/documentation/" },
                            { label: "Database Migrations (Flyway)", url: "https://flywaydb.org/documentation/" },
                        ],
                    },
                    {
                        label: "Security",
                        children: [
                            { label: "Spring Security", url: "https://docs.spring.io/spring-security/reference/" },
                            { label: "JWT with Spring", url: "https://www.baeldung.com/spring-security-oauth-jwt" },
                            { label: "OAuth 2.0", url: "https://spring.io/projects/spring-authorization-server" },
                        ],
                    },
                ],
            },
            {
                label: "Microservices",
                children: [
                    { label: "Spring Cloud Gateway", url: "https://spring.io/projects/spring-cloud-gateway" },
                    { label: "Eureka Service Discovery", url: "https://spring.io/projects/spring-cloud-netflix" },
                    { label: "OpenFeign Client", url: "https://spring.io/projects/spring-cloud-openfeign" },
                    { label: "Resilience4j", url: "https://resilience4j.readme.io/" },
                ],
            },
            {
                label: "Testing & DevOps",
                children: [
                    { label: "JUnit 5", url: "https://junit.org/junit5/docs/current/user-guide/" },
                    { label: "Mockito", url: "https://site.mockito.org/" },
                    { label: "Testcontainers", url: "https://testcontainers.com/" },
                    { label: "Docker & Kubernetes", url: "https://spring.io/guides/gs/spring-boot-docker/" },
                ],
            },
        ],
    },
];
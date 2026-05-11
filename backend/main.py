import time
import logging
import logging.config
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

# ── Logging config ────────────────────────────────────────────────────────────
logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        }
    },
    "root": {"level": "INFO", "handlers": ["console"]},
})

log = logging.getLogger("main")

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Bird Classifier API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


# ── Startup: confirm models loaded and measure how long it took ───────────────
@app.on_event("startup")
async def startup_event():
    from ml.models import image_model, audio_model  # already loaded; just confirm
    log.info("✓ image_model loaded")
    log.info("✓ audio_model loaded")
    log.info("Server ready.")


# ── Per-request wall-clock timer ──────────────────────────────────────────────
@app.middleware("http")
async def log_request_time(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start
    log.info(f"[http] {request.method} {request.url.path}  →  {response.status_code}  ({elapsed:.2f}s)")
    return response
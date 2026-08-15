import logging
import sys

from app.core.config import settings


def configure_logging() -> None:
    """
    Configure application-wide logging.
    """

    log_level = (
        logging.DEBUG
        if settings.ENVIRONMENT == "development"
        else logging.INFO
    )

    formatter = logging.Formatter(
        fmt=(
            "%(asctime)s | "
            "%(levelname)s | "
            "%(name)s | "
            "%(message)s"
        ),
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    root_logger = logging.getLogger()

    root_logger.setLevel(log_level)

    # Prevent duplicate handlers when Uvicorn reloads.
    if not root_logger.handlers:
        root_logger.addHandler(console_handler)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
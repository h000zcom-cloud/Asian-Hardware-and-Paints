"""Exact frontend origins allowed to make credentialed API requests."""

from urllib.parse import urlsplit


DEFAULT_CORS_ORIGIN = "https://ah.2up.in"


def parse_cors_origins(value: str | None) -> list[str]:
    """Allow the canonical site and any explicitly configured full origins."""
    origins = [DEFAULT_CORS_ORIGIN]
    value = value or ""
    for entry in value.split(","):
        origin = entry.strip().rstrip("/")
        parsed = urlsplit(origin)
        if (
            parsed.scheme not in ("http", "https")
            or not parsed.hostname
            or parsed.username is not None
            or parsed.password is not None
            or "*" in parsed.netloc
            or origin != f"{parsed.scheme}://{parsed.netloc}"
        ):
            continue
        if origin not in origins:
            origins.append(origin)
    return origins

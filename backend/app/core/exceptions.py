class AppException(Exception):
    """
    Base application exception.

    Services and repositories raise application-level
    exceptions instead of FastAPI HTTPException.
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class UnauthorizedException(AppException):
    pass


class ForbiddenException(AppException):
    pass


class NotFoundException(AppException):
    pass


class ConflictException(AppException):
    pass


class ValidationException(AppException):
    pass


class BadRequestException(AppException):
    pass
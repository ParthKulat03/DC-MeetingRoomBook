from app.core.security import (
    create_access_token,
    decode_access_token,
)


class TokenService:

    def create_access_token(
        self,
        user_id: str,
        role: str,
    ) -> str:

        return create_access_token(
            subject=user_id,
            extra_claims={
                "role": role,
            },
        )

    def decode_token(
        self,
        token: str,
    ) -> dict:

        return decode_access_token(token)
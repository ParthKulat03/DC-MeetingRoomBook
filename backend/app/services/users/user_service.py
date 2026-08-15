from uuid import UUID

from app.core.exceptions import (
    ConflictException,
    NotFoundException,
)
from app.core.security import hash_password
from app.models.user import (
    ApprovalStatus,
    User,
    UserStatus,
    VerificationStatus,
)
from app.repositories.role_repository import RoleRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    UserCreateRequest,
    UserUpdateRequest,
)


class UserService:

    def __init__(
        self,
        user_repository: UserRepository,
        role_repository: RoleRepository,
    ):
        self.user_repository = user_repository
        self.role_repository = role_repository

    async def get_user(
        self,
        user_id: UUID,
    ) -> User:

        user = await self.user_repository.get_by_id(
            user_id
        )

        if not user:
            raise NotFoundException(
                "User not found"
            )

        return user

    async def create_user(
        self,
        data: UserCreateRequest,
    ) -> User:

        existing_email = (
            await self.user_repository.get_by_email(
                data.email
            )
        )

        if existing_email:
            raise ConflictException(
                "Email already exists"
            )

        existing_employee = (
            await self.user_repository.get_by_employee_id(
                data.employee_id
            )
        )

        if existing_employee:
            raise ConflictException(
                "Employee ID already exists"
            )

        role = await self.role_repository.get_by_name(
            data.role
        )

        if not role:
            raise NotFoundException(
                "Role not found"
            )

        user = User(
            employee_id=data.employee_id,
            name=data.name,
            email=data.email.lower(),
            designation=data.designation,
            role_id=role.id,
            password_hash=hash_password(
                "ChangeMe@123"
            ),
            status=UserStatus.ACTIVE,
            verification_status=(
                VerificationStatus.VERIFIED
            ),
            approval_status=(
                ApprovalStatus.APPROVED
            ),
        )

        return await self.user_repository.create(
            user
        )

    async def update_user(
        self,
        user_id: UUID,
        data: UserUpdateRequest,
    ) -> User:

        user = await self.get_user(user_id)

        updates = data.model_dump(
            exclude_unset=True
        )

        if "email" in updates:
            email_user = (
                await self.user_repository.get_by_email(
                    updates["email"]
                )
            )

            if email_user and email_user.id != user.id:
                raise ConflictException(
                    "Email already exists"
                )

            updates["email"] = updates["email"].lower()

        if "employee_id" in updates:
            employee_user = (
                await self.user_repository.get_by_employee_id(
                    updates["employee_id"]
                )
            )

            if (
                employee_user
                and employee_user.id != user.id
            ):
                raise ConflictException(
                    "Employee ID already exists"
                )

        if "role" in updates:
            role = await self.role_repository.get_by_name(
                updates.pop("role")
            )

            if not role:
                raise NotFoundException(
                    "Role not found"
                )

            user.role_id = role.id

        for key, value in updates.items():
            setattr(user, key, value)

        return await self.user_repository.update(
            user
        )

    async def approve_user(
        self,
        user_id: UUID,
    ) -> User:

        user = await self.get_user(user_id)

        user.approval_status = ApprovalStatus.APPROVED

        return await self.user_repository.update(
            user
        )

    async def reject_user(
        self,
        user_id: UUID,
    ) -> User:

        user = await self.get_user(user_id)

        user.approval_status = ApprovalStatus.REJECTED

        return await self.user_repository.update(
            user
        )

    async def enable_user(
        self,
        user_id: UUID,
    ) -> User:

        user = await self.get_user(user_id)

        user.status = UserStatus.ACTIVE

        return await self.user_repository.update(
            user
        )

    async def disable_user(
        self,
        user_id: UUID,
    ) -> User:

        user = await self.get_user(user_id)

        user.status = UserStatus.DISABLED

        return await self.user_repository.update(
            user
        )
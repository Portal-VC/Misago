from django.contrib.auth import get_user_model
from django.test import TestCase

from misago.acl import useracl
from misago.acl.test import patch_user_acl

User = get_user_model()

cache_versions = {"acl": "abcdefgh"}


def callable_acl_patch(user, user_acl):
    user_acl["patched_for_user_id"] = user.id


class PatchingUserACLTests(TestCase):
    @patch_user_acl({"is_patched": True})
    def test_decorator_patches_all_users_acls_in_test(self):
        user = User.objects.create_user("User", "user@example.com")
        user_acl = useracl.get_user_acl(user, cache_versions)
        assert user_acl["is_patched"]

    def test_decorator_removes_patches_after_test(self):
        user = User.objects.create_user("User", "user@example.com")

        @patch_user_acl({"is_patched": True})
        def test_function(patch_user_acl):
            user_acl = useracl.get_user_acl(user, cache_versions)
            assert user_acl["is_patched"]

        user_acl = useracl.get_user_acl(user, cache_versions)
        assert "is_patched" not in user_acl

    def test_context_manager_patches_all_users_acls_in_test(self):
        user = User.objects.create_user("User", "user@example.com")
        with patch_user_acl({"can_rename_users": "patched"}):
            user_acl = useracl.get_user_acl(user, cache_versions)
            assert user_acl["can_rename_users"] == "patched"

    def test_context_manager_removes_patches_after_exit(self):
        user = User.objects.create_user("User", "user@example.com")

        with patch_user_acl({"is_patched": True}):
            user_acl = useracl.get_user_acl(user, cache_versions)
            assert user_acl["is_patched"]

        user_acl = useracl.get_user_acl(user, cache_versions)
        assert "is_patched" not in user_acl

    @patch_user_acl(callable_acl_patch)
    def test_callable_patch_is_called_with_user_and_acl_by_decorator(self):
        user = User.objects.create_user("User", "user@example.com")
        user_acl = useracl.get_user_acl(user, cache_versions)
        assert user_acl["patched_for_user_id"] == user.id

    def test_callable_patch_is_called_with_user_and_acl_by_context_manager(self):
        user = User.objects.create_user("User", "user@example.com")
        with patch_user_acl(callable_acl_patch):
            user_acl = useracl.get_user_acl(user, cache_versions)
            assert user_acl["patched_for_user_id"] == user.id

    @patch_user_acl({"acl_patch": 1})
    @patch_user_acl({"acl_patch": 2})
    def test_multiple_acl_patches_applied_by_decorator_stack(self):
        user = User.objects.create_user("User", "user@example.com")
        user_acl = useracl.get_user_acl(user, cache_versions)
        assert user_acl["acl_patch"] == 2

    def test_multiple_acl_patches_applied_by_context_manager_stack(self):
        user = User.objects.create_user("User", "user@example.com")
        with patch_user_acl({"acl_patch": 1}):
            with patch_user_acl({"acl_patch": 2}):
                user_acl = useracl.get_user_acl(user, cache_versions)
                assert user_acl["acl_patch"] == 2
            user_acl = useracl.get_user_acl(user, cache_versions)
            assert user_acl["acl_patch"] == 1
        user_acl = useracl.get_user_acl(user, cache_versions)
        assert "acl_patch" not in user_acl
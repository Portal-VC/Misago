from unittest.mock import Mock

from django.test import TestCase

from misago.acl.context_processors import user_acl


class ContextProcessorsTests(TestCase):
    def test_context_processor_adds_request_user_acl_to_context(self):
        test_acl = {"test": True}
        context = user_acl(Mock(user_acl=test_acl))
        assert context == {"user_acl": test_acl}
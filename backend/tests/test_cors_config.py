import unittest

from backend.cors_config import parse_cors_origins


class CorsConfigTests(unittest.TestCase):
    def test_default_is_the_exact_live_frontend(self):
        self.assertEqual(parse_cors_origins(None), ["https://ah.2up.in"])

    def test_explicit_origins_keep_scheme_and_port(self):
        self.assertEqual(
            parse_cors_origins(" https://ah.2up.in/,http://localhost:3000,https://ah.2up.in "),
            ["https://ah.2up.in", "http://localhost:3000"],
        )

    def test_no_wildcards_or_implicit_schemes(self):
        self.assertEqual(
            parse_cors_origins("*.vercel.app,https://*.2up.in,ah.2up.in,*,value"),
            ["https://ah.2up.in"],
        )

    def test_rejects_paths_and_userinfo(self):
        self.assertEqual(
            parse_cors_origins("https://ah.2up.in/admin,https://user@ah.2up.in"),
            ["https://ah.2up.in"],
        )

    def test_configured_origins_do_not_remove_the_live_site(self):
        self.assertEqual(
            parse_cors_origins("https://asian-hardware.vercel.app"),
            ["https://ah.2up.in", "https://asian-hardware.vercel.app"],
        )


if __name__ == "__main__":
    unittest.main()

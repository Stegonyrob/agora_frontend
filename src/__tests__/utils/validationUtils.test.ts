import { sanitizeInput, validateInput } from "../../utils/validationUtils";

describe("validationUtils", () => {
  describe("validateInput", () => {
    it("should return true for valid alphanumeric characters", () => {
      expect(validateInput("abc123")).toBe(true);
      expect(validateInput("TEST")).toBe(true);
      expect(validateInput("test123")).toBe(true);
    });

    it("should return true for allowed special characters", () => {
      expect(validateInput("user_name")).toBe(true);
      expect(validateInput("user@domain.com")).toBe(true);
      expect(validateInput("file.name")).toBe(true);
      expect(validateInput("user-name")).toBe(true);
    });

    it("should return true for combination of valid characters", () => {
      expect(validateInput("user.email@domain.com")).toBe(true);
      expect(validateInput("test_file-name.txt")).toBe(true);
      expect(validateInput("user123@test.co")).toBe(true);
    });

    it("should return true for empty string", () => {
      expect(validateInput("")).toBe(true);
    });

    it("should return false for invalid characters", () => {
      expect(validateInput("test<script>")).toBe(false);
      expect(validateInput("user name")).toBe(false); // space
      expect(validateInput("test#hash")).toBe(false);
      expect(validateInput("user%percent")).toBe(false);
      expect(validateInput("test&amp;")).toBe(false);
    });

    it("should return false for special symbols", () => {
      expect(validateInput("test!exclamation")).toBe(false);
      expect(validateInput("test$dollar")).toBe(false);
      expect(validateInput("test*asterisk")).toBe(false);
      expect(validateInput("test+plus")).toBe(false);
      expect(validateInput("test=equals")).toBe(false);
    });
  });

  describe("sanitizeInput", () => {
    it("should trim whitespace from beginning and end", () => {
      expect(sanitizeInput("  hello  ")).toBe("hello");
      expect(sanitizeInput("\t\ntest\t\n")).toBe("test");
      expect(sanitizeInput("   spaced   ")).toBe("spaced");
    });

    it("should escape HTML special characters", () => {
      expect(sanitizeInput("<script>")).toBe("&lt;script&gt;");
      expect(sanitizeInput("<div>content</div>")).toBe(
        "&lt;div&gt;content&lt;/div&gt;"
      );
      expect(sanitizeInput("test<tag>content</tag>")).toBe(
        "test&lt;tag&gt;content&lt;/tag&gt;"
      );
    });

    it("should escape quotes", () => {
      expect(sanitizeInput('"double quotes"')).toBe(
        "&quot;double quotes&quot;"
      );
      expect(sanitizeInput("'single quotes'")).toBe(
        "&#039;single quotes&#039;"
      );
      expect(sanitizeInput(`Mixed "double" and 'single' quotes`)).toBe(
        "Mixed &quot;double&quot; and &#039;single&#039; quotes"
      );
    });

    it("should handle combination of issues", () => {
      expect(
        sanitizeInput("  <script src=\"evil.js\">alert('xss')</script>  ")
      ).toBe(
        "&lt;script src=&quot;evil.js&quot;&gt;alert(&#039;xss&#039;)&lt;/script&gt;"
      );
    });

    it("should handle empty and whitespace-only strings", () => {
      expect(sanitizeInput("")).toBe("");
      expect(sanitizeInput("   ")).toBe("");
      expect(sanitizeInput("\t\n\r")).toBe("");
    });

    it("should preserve normal text", () => {
      expect(sanitizeInput("normal text")).toBe("normal text");
      expect(sanitizeInput("user@domain.com")).toBe("user@domain.com");
      expect(sanitizeInput("File_name-123.txt")).toBe("File_name-123.txt");
    });

    it("should handle mixed content correctly", () => {
      expect(sanitizeInput('  Hello <b>world</b> "test"  ')).toBe(
        "Hello &lt;b&gt;world&lt;/b&gt; &quot;test&quot;"
      );
    });
  });
});

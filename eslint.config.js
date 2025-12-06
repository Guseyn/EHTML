export default [

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly"
      }
    },

    rules: {
      // Semicolons required
      "semi": ["error", "always"],

      // 2 space indentation
      "indent": ["error", 2],

      // Clean JS basics
      "no-unused-vars": "off",
      "no-undef": "off",

      // Style: double quotes
      "quotes": ["error", "double"],

      // No trailing commas
      "comma-dangle": ["error", "never"]
    }
  }

]

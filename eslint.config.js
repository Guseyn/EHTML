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
      "semi": ["error", "never"],

      // 2 space indentation
      "indent": ["error", 2],

      // Clean JS basics
      "no-unused-vars": "off",
      "no-undef": "off",

      // Style: double quotes
      "quotes": ["error", "single"],

      // No trailing commas
      "comma-dangle": ["error", "never"],

      "no-multi-spaces": "error"
    }
  }

]

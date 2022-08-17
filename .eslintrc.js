module.exports = {
  root: true,
  extends: [
    "plugin:vue/base",
    "eslint:recommended",
    "plugin:vue/recommended",
    "prettier",
  ],
  plugins: ["react"],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    node: true,
  },
  globals: {
    PKG_VERSION: true,
  },
  settings: {
    "import/resolver": {
      node: null,
      webpack: {
        config: "build/webpack-configs/base.js",
      },
    },
  },
  rules: {
    "import/no-named-as-default": 0,
    "unicorn/consistent-function-scoping": 0,
    "vue/attributes-order": 0,
    "vue/no-v-html": 0,
    "vue/multi-word-component-names": 0,
    "vue/component-definition-name-casing": 0,
    "no-confusing-arrow": 0,
    "no-console": 0,
    "no-warning-comments": 0,
    "no-undefined": 0,
    "prefer-destructuring": 0,
    "no-unused-vars": ["error", { argsIgnorePattern: "h" }],
  },
  overrides: [
    {
      files: ["src/**"],
      rules: {
        "unicorn/no-for-loop": 0,
        "unicorn/prefer-includes": 0,
        "no-restricted-syntax": [
          "error",
          {
            selector:
              "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
            message: "Unexpected property on console object was called",
          },
        ],
      },
    },
  ],
};

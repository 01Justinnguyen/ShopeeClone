// /* eslint-disable @typescript-eslint/no-var-requires */
// const path = require('path')

// module.exports = {
//   extends: [
//     // Chúng ta sẽ dùng các rule mặc định từ các plugin mà chúng ta đã cài.
//     'eslint:recommended',
//     'plugin:react/recommended',
//     'plugin:react-hooks/recommended',
//     'plugin:import/recommended',
//     'plugin:import/typescript',
//     'plugin:jsx-a11y/recommended',
//     'plugin:@typescript-eslint/recommended',
//     // Disable các rule mà eslint xung đột với prettier.
//     // Để cái này ở dưới để nó override các rule phía trên!.
//     'eslint-config-prettier',
//     'prettier'
//   ],
//   plugins: ['prettier'],
//   settings: {
//     react: {
//       // Nói eslint-plugin-react tự động biết version của React.
//       version: 'detect'
//     },
//     // Nói ESLint cách xử lý các import
//     'import/resolver': {
//       node: {
//         paths: [path.resolve(__dirname, '')],
//         extensions: ['.js', '.jsx', '.ts', '.tsx']
//       }
//       // typescript: {},
//       // alias: {
//       //   map: [
//       //     ['@', './src'] // Đặt alias `@` trỏ đến thư mục `src`
//       //   ],
//       //   extensions: ['.js', '.jsx', '.ts', '.tsx']
//       // },
//       // node: {
//       //   extensions: ['.js', '.jsx', '.ts', '.tsx'],
//       //   moduleDirectory: ['node_modules', 'src/']
//       // }
//     }
//   },
//   env: {
//     node: true
//   },
//   rules: {
//     // Tắt rule yêu cầu import React trong file jsx
//     'react/react-in-jsx-scope': 'off',
//     '@typescript-eslint/no-explicit-any': 'warn',
//     // Cảnh báo khi thẻ <a target='_blank'> mà không có rel="noreferrer"
//     'react/jsx-no-target-blank': 'warn',
//     // Tăng cường một số rule prettier (copy từ file .prettierrc qua)
//     'prettier/prettier': [
//       'warn',
//       {
//         arrowParens: 'always',
//         semi: false,
//         trailingComma: 'none',
//         tabWidth: 2,
//         endOfLine: 'auto',
//         useTabs: false,
//         singleQuote: true,
//         printWidth: 120,
//         jsxSingleQuote: true
//       }
//     ]
//   }
// }

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  extends: 'react-app',
  extends: [
    // Chúng ta sẽ dùng các rule mặc định từ các plugin mà chúng ta đã cài.
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    // Disable các rule mà eslint xung đột với prettier.
    // Để cái này ở dưới để nó override các rule phía trên!.
    'eslint-config-prettier',
    'prettier'
  ],
  plugins: ['prettier'],
  settings: {
    react: {
      // Nói eslint-plugin-react tự động biết version của React.
      version: 'detect'
    },
    // Nói ESLint cách xử lý các import
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, '')],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  compilerOptions: {
    baseUrl: '.', // Cài đặt baseUrl là thư mục gốc của dự án
    paths: {
      '@/*': ['src/*'] // Định nghĩa đường dẫn tương đối
    }
  },
  env: {
    node: true
  },
  eslintConfig: {
    extends: 'react-app'
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // Tắt rule yêu cầu import React trong file jsx
    'react/react-in-jsx-scope': 'off',
    // Cảnh báo khi thẻ <a target='_blank'> mà không có rel="noreferrer"
    'react/jsx-no-target-blank': 'warn',
    // Tăng cường một số rule prettier (copy từ file .prettierrc qua)
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ]
  }
}

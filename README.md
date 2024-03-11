# io-fims

## Prerequisites

This project requires specific versions of the following tools. To make sure your development setup matches with production follow the recommended installation methods.

- **Node.js**

  Use [nodenv](https://github.com/nodenv/nodenv) to install the [required version](.node-version) of `Node.js`.

  ```sh
  nodenv install
  node --version
  ```

- **Yarn**

  Yarn must be installed using [Corepack](https://yarnpkg.com/getting-started/install), included by default in `Node.js`.

  ```sh
  corepack enable
  yarn --version
  ```

- **Terraform**

  Use [tfenv](https://github.com/tfutils/tfenv) to install the [required version](.terraform-version) of `terraform`.

  ```sh
  tfenv install
  terraform version
  ```

- **pre-commit**

  [Follow the official documentation](https://pre-commit.com/) to install `pre-commit` in your machine.

  ```sh
  pre-commit install
  ```

## Setup

1. Install the dependencies using `yarn`

   ```sh
   yarn install
   ```

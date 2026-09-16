# UniBus FrontEnd

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white" alt="Yarn" />
</p>

Repositório do projeto UniBus FrontEnd.

## 📌 Sobre o projeto

O UniBus FrontEnd é a interface do sistema UniBus, responsável por fornecer uma experiência moderna e amigável para os usuários interagirem com a aplicação.

## 🚀 Tecnologias

- React
- TypeScript
- JavaScript
- Yarn
- Design System @nexpy/design-system

## ✅ Pré-requisitos

Antes de começar, verifique se você possui as ferramentas abaixo instaladas no seu computador:

```bash
node --version
npm --version
```

## 🛠️ Instalação

### 1) Instalar o Yarn

```bash
npm install --global yarn
```

Verifique a instalação:

```bash
yarn --version
```

Se o Yarn não for reconhecido no PowerShell, execute:

```powershell
$env:Path += ";$(npm config get prefix)"
```

Feche e abra o terminal novamente e rode:

```bash
yarn --version
```

### 2) Instalar dependências do projeto

Entre na pasta do projeto:

```bash
cd C:\caminho\para\UniBus_FrontEnd
```

Em seguida:

```bash
yarn install
```

### 3) Instalar o Design System

```bash
yarn add @nexpy/design-system
```

A versão atual utilizada no projeto é:

```bash
@nexpy/design-system@3.1.8
```

## 🎨 Como usar o Design System

Você pode importar os componentes diretamente do pacote:

```tsx
import { Button } from '@nexpy/design-system';
```

Exemplo:

```tsx
import { Button } from '@nexpy/design-system';

export function Home() {
  return (
    <Button>
      Continuar
    </Button>
  );
}
```

Consulte a documentação oficial do Design System para conhecer os componentes, propriedades e variantes disponíveis.

## ▶️ Executando o projeto

Verifique os scripts disponíveis no arquivo `package.json` e execute:

```bash
yarn dev
```

ou

```bash
yarn start
```

## 🧩 Scripts principais

```bash
# Instalar Yarn
npm install --global yarn

# Instalar dependências
yarn install

# Instalar Design System
yarn add @nexpy/design-system

# Executar projeto
yarn dev
```

## ⚠️ Observação

Evite misturar `npm install` e `yarn` no mesmo projeto. Se o repositório possui `yarn.lock`, prefira usar Yarn.

## 📁 Estrutura do projeto

```bash
UniBus_FrontEnd/
├── public/
├── src/
├── package.json
├── yarn.lock
├── README.md
└── ...
```

## 🤝 Contribuição

Contribuições são bem-vindas. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas alterações
4. Abra um pull request

## 📄 Licença

Este projeto está sob a licença indicada no repositório.

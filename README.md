# UniBus Frontend

Interface web do projeto UniBus, desenvolvida com Next.js, React e TypeScript.

## Requisitos

- Node.js 20.9 ou superior
- pnpm 12

## Instalar o pnpm

### Windows

1. Abra o PowerShell.
2. Execute:

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

3. Reabra o terminal e verifique:

```powershell
pnpm --version
```

### Linux

1. Abra o terminal.
2. Execute:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

3. Reabra o terminal e verifique:

```bash
pnpm --version
```

Consulte a [documentação oficial do pnpm](https://pnpm.io/pt/installation) em caso de dúvidas.

## Instalação do projeto

```bash
pnpm install
```

## Executar

Inicie o ambiente de desenvolvimento:

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Produção

```bash
pnpm build
pnpm start
```

## Verificação

```bash
pnpm lint
```

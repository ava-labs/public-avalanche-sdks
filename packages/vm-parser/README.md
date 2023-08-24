<br/>

<p align="center">
  <a href="https://subnets.avax.network/">
      <picture>
        <img alt="Avalanche Logo" src="https://raw.githubusercontent.com/ava-labs/public-avalanche-sdks/main/packages/vm-parser/src/assets/Avalanche_Horizontal_White.svg?token=GHSAT0AAAAAABXWR5JN42WPZEYQSCC63P3YZGRGOUA" width="auto" height="60">
      </picture>
</a>
</p>

<p align="center">
  Parse arbitrary VM data for display in the Avalanche Subnet Explorer.
<p>

<br>

## Supported VMs

- MoveVM

## Getting Started

```sh
  npm install @avalabs/vm-parser
  # or
  yarn add @avalabs/vm-parser
  # or
  pnpm add @avalabs/vm-parser
```

## Overview

```tsx
// 1. Import modules.
import { createMoveVmConfig, DataDisplayFormat } from '@avalabs/vm-parser';
import {
  Card,
  CardTitle,
  CardContent,
  Chip,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from 'some-ui-library';
import useSWR from 'swr'; // Or your preferred data fetching library

const MOVE_RPC_URL =
  'https://seed-node1-rpc.movementlabs.xyz/ext/bc/2gLyawqthdiyrJktJmdnDAb1XVc6xwJXU6iJKu3Uwj21F2mXAK/rpc';
// 2. Set up your config
const moveVmConfig = createMoveVmConfig(MOVE_RPC_URL);

const TransactionDetails = ({ txId }: { txId: string }) => {
  // 2. Get the data from the config's `getPageData` function
  const { data } = useSWR(txId, moveVmConfig.transactionDetails.getPageData);

  // 3. Display the data dynamically based on the config's displayFormat.
  return (
    <>
      {moveVmConfig.displayFormat.map(({ sectionTitle, fields }) => (
        <Card>
          <CardTitle>{sectionTitle}</CardTitle>
          <CardContent>
            <TableContainer>
              <Table>
                <TableBody>
                  {fields.map(({ name, displayValue, displayFormat }) => (
                    <TableRow>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>
                        /* Display the field differently depending on its display formatter */
                        {field.displayFormat === DataDisplayFormat.CHIP ? (
                          <Chip>{field.displayValue}</Chip>
                        ) : field.displayFormat === DataDisplayFormat.DATETIME ? (
                          new Date(field.displayValue).toLocaleString()
                        ) : (
                          fields.displayValue
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
```

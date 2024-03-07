import {
  isExportTx,
  isImportTx,
  useLatestTeleporterTransactions,
  type Erc20TransferWithChain,
} from '@/hooks/use-transactions';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { cn } from '@/utils/cn';
import { truncateAddress } from '@/utils/truncate-address';
import { isEmpty, isNil } from 'lodash-es';
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { FancyAvatar } from './fancy-avatar';
import Big from 'big.js';
import { bigToDisplayString } from '@/utils/format-string';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { memo, useMemo, useState } from 'react';
import type { Address } from 'viem';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { Typography, typographyVariants } from '@/ui/typography';
import { Badge } from '@/ui/badge';

dayjs.extend(relativeTime);

const TransactionRow = memo(({ address, tx }: { address: Address; tx: Erc20TransferWithChain }) => {
  const isExport = isExportTx(tx, address);
  const isImport = isImportTx(tx, address);
  return (
    <Card
      className="w-full"
      key={tx.txHash}
    >
      <CardContent className="flex items-center py-2 px-4">
        <div className=" flex">
          <FancyAvatar
            src={tx.chain.logoUrl}
            label={tx.chain.shortName}
            className="w-10 h-10"
          />
        </div>
        <div className="flex flex-col items-start ml-2">
          <div className="flex justify-center items-center">
            <Button
              variant="link"
              size="link"
              className={cn(typographyVariants({ size: 'xs' }), '-my-2 font-mono')}
              endIcon={<ExternalLink className="h-3 w-3 ml-1" />}
            >
              {truncateAddress(tx.txHash)}
            </Button>
            <CheckCircle className="ml-3 w-3 h-3 stroke-emerald-500" />
            <Typography
              size="xs"
              className="ml-1 text-muted-foreground"
            >
              {dayjs(tx.blockTimestamp * 1000).fromNow()}
            </Typography>
          </div>
          {isExport ? (
            <Badge
              className="bg-amber-800 hover:bg-amber-800/80  text-foreground"
              startIcon={<ArrowRight />}
            >
              Export
            </Badge>
          ) : isImport ? (
            <Badge
              className="bg-sky-800 hover:bg-sky-800/80 text-foreground"
              startIcon={<ArrowLeft />}
            >
              Import
            </Badge>
          ) : null}
        </div>
        <div className="flex grow items-center justify-end">
          <Typography size="lg">
            {bigToDisplayString(new Big(tx.value).div(10 ** tx.erc20Token.decimals))}{' '}
            <Typography
              size="md"
              className="text-muted-foreground"
            >
              {tx.erc20Token.symbol}
            </Typography>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
});

const COLLAPSED_TRANSACTIONS_COUNT = 2;
export const ActivityFeed = () => {
  const { address } = useAccount();
  const { data: transactions, isLoading } = useLatestTeleporterTransactions();

  const [firstChunkTransactions, secondChunkTransactions] = useMemo(() => {
    if (!transactions) {
      return [];
    }

    const firstChunk = transactions.slice(0, COLLAPSED_TRANSACTIONS_COUNT);
    const secondChunk = transactions.slice(COLLAPSED_TRANSACTIONS_COUNT);
    return [firstChunk, secondChunk];
  }, [transactions]);

  if (isLoading || !address || isNil(firstChunkTransactions) || isEmpty(firstChunkTransactions)) {
    return null;
  }

  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <div className="w-full flex flex-col gap-4 mt-48">
      <Typography
        size="lg"
        className="ml-2"
        asChild
      >
        <h2>Your Activity</h2>
      </Typography>
      <Collapsible
        open={expanded}
        onOpenChange={setExpanded}
      >
        <div className="flex flex-col gap-2">
          {firstChunkTransactions.map((tx) => {
            return (
              <TransactionRow
                key={tx.txHash}
                address={address}
                tx={tx}
              />
            );
          })}
          {!isNil(secondChunkTransactions) && !isEmpty(secondChunkTransactions) && (
            <>
              <CollapsibleContent className="flex flex-col gap-2">
                {secondChunkTransactions.map((tx) => {
                  return (
                    <TransactionRow
                      key={tx.txHash}
                      address={address}
                      tx={tx}
                    />
                  );
                })}
              </CollapsibleContent>
            </>
          )}
        </div>
        <div className="w-full flex justify-center">
          <CollapsibleTrigger>
            <Button variant="ghost">See {expanded ? 'Less' : 'More'}</Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
};

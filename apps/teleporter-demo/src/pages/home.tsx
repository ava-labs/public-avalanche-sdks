import { memo } from 'react';
import { TeleporterForm } from '@/components/teleporter-form';
import { Card, CardContent, CardTitle } from '@/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { MintForm } from '@/components/mint-form';

export const Home = memo(() => {
  return (
    <Tabs
      defaultValue="teleport"
      className="w-full mt-4 sm:mt-8"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="teleport">Teleport</TabsTrigger>
        <TabsTrigger value="mint">Mint</TabsTrigger>
      </TabsList>
      <TabsContent value="teleport">
        <Card className="flex grow">
          <CardContent className="w-full max-sm:px-0">
            <CardTitle>
              <span className="ml-6">Teleport</span>
            </CardTitle>
            <CardContent>
              <TeleporterForm />
            </CardContent>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="mint">
        <Card className="flex grow">
          <CardContent className="w-full max-sm:px-0">
            <CardTitle>
              <span className="ml-6">Mint</span>
            </CardTitle>
            <CardContent>
              <MintForm />
            </CardContent>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
});

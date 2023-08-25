import { useState } from 'react';
import { TeleporterForm } from './components/teleporter-form';

export const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Teleporter</h1>
      <TeleporterForm />
    </>
  );
};

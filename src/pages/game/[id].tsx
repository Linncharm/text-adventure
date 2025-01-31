import Game from '../../components/Game';
import React from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";

const GamePage: React.FC = () => {

  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Game {id}</title>
        <meta name="description" content={`This is the page for game ${id}.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>
      <Game gameId={id as string} />
    </>

  );
};

export default GamePage;

import Head from 'next/head'
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useAppContext } from '../context/ContractContext';

export default function Home() {

  const { isAuthenticated, authenticate } = useMoralis();
  const {web3, getRole} = useAppContext();


  useEffect(() => {
    if (isAuthenticated && web3){
        getRole();
    }
  }, [isAuthenticated, web3]);


  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <Head>
        <title>AcademicBlock</title>
        <meta name="description" content="Histórico academico na blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button
        className="py-4 text-xl bg-yellow-300 px-7 rounded-xl animate-pulse" onClick={() =>
          authenticate({ signingMessage: "Autorize a conexão com sua carteira" })
        }
      >
        Login using Metamask
      </button>
    </div >
  )
}

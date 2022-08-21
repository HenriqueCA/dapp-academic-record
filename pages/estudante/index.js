import StudentNavbar from '../../components/StudentNavbar';
import RecordComponent from '../../components/RecordComponent';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/ContractContext';
import axios from 'axios';
import { useMoralis } from 'react-moralis';

export default function Record() {

    const {getNFT, web3} = useAppContext();

    const {account} = useMoralis();

    const [NFTMetadata, setNFTMetadata] = useState({});

    const fetchNFT = async () => {
        const NFTUri = await getNFT(account);
        console.log(NFTUri)
        try {
            const response = await axios.get(NFTUri);
            setNFTMetadata(response.data);
        } catch(error) {console.log(error)}
    }

    useEffect(() => {
        if(web3 && account) {
            fetchNFT();
        }
    }, [web3, account])

    return (
        <>
            <StudentNavbar active={"HISTÓRICO"} />
            <RecordComponent NFTMetadata={NFTMetadata} />
        </>
    )
}
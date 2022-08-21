import ProfessorNavbar from '../../components/ProfessorNavbar';
import { IoChevronDownOutline } from 'react-icons/io5'
import { useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import { useCallback, useRef } from 'react';
import RecordComponent from '../../components/RecordComponent';
import { useAppContext } from '../../context/ContractContext';
import axios from 'axios';
import { useMoralisFile } from 'react-moralis';
import { useRouter } from 'next/router';

const Student = ({ wallet, subjectData, studentsNewMetadata, setStudentsNewMetadata }) => {

    const { allUsers, getNFT, web3 } = useAppContext();

    const [NFTMetadata, setNFTMetadata] = useState();

    const [grade, setGrade] = useState();


    const user = allUsers.filter(user => {
        return user.address === wallet.toLowerCase();
    })

    const name = user && user[0] ? user[0].name : '';

    const handleChange = (e) => {
        const value = e.target.value;
        const re = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
        if (re.test(value) || value == '') {
            if (Number(value) <= 10) {
                setGrade(value);
            }
        }
    }
    const fetchNFT = async () => {
        const NFTUri = await getNFT(wallet);
        try {
            const response = await axios.get(NFTUri);
            setNFTMetadata(response.data);
        } catch (error) { console.log(error) }
    }

    useEffect(() => {
        if (web3) {
            fetchNFT();
        }
    }, [web3])

    const ref = useRef(null);

    const generateNewImage = async () => {
        const new_subject = {
            code: subjectData.code,
            name: subjectData.name,
            mandatory: subjectData.mandatory,
            credits: subjectData.credits,
            workload: subjectData.workload,
            grade: grade,
            term: '2022.1'
        };

        const newNFTMetadata = {...NFTMetadata};

        newNFTMetadata.subjects.push(new_subject);

        const dataUrl = await makeRecordImage();

        newNFTMetadata.image = dataUrl;

        setStudentsNewMetadata({ ...studentsNewMetadata, [wallet]: newNFTMetadata })
    }


    const makeRecordImage = useCallback(async () => {
        if (ref.current === null) {
            return
        }

        const dataUrl = await toPng(ref.current, { cacheBust: true });

        return dataUrl;

    }, [ref])

    return (
        <>
            <div className='flex items-center px-4 py-2 text-left bg-gray-100 border '>
                <p className='flex-1 text-xl truncate'>{name ? name : wallet}</p>
                <div className='flex items-center gap-2 w-28'>
                    <label htmlFor='grade' className='text-sm font-medium text-gray-900'>Média:</label>
                    <input id="grade" maxLength={3} name="grade" type="text" placeholder='8.4' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' value={grade || ''} onChange={handleChange} onBlur={generateNewImage} />
                </div>
            </div>
            <div className='h-0 overflow-hidden'>
                <RecordComponent divRef={ref} NFTMetadata={NFTMetadata} />
            </div>
        </>
    )
}

const Subject = ({ data }) => {

    const { name, enrolleds } = data;

    const [studentsNewMetadata, setStudentsNewMetadata] = useState({});

    const [open, setOpen] = useState(true);

    const { saveFile } = useMoralisFile();

    const {updateNFTUris} = useAppContext();

    const router = useRouter();

    const sendGrades = async () => {
        const walletList = [];
        const uriList = [];
        for (const [key, value] of Object.entries(studentsNewMetadata)) {
            const result = await saveFile(
                "student_nft.json",
                { base64: btoa(JSON.stringify(value)) },
                {
                    type: 'base64',
                    saveIPFS: true,
                }
            );
            walletList.push(key);
            uriList.push(result._ipfs);
        }

        await updateNFTUris(walletList, uriList, data.code);

    }


    return (

        <div className='flex flex-col justify-center w-full '>
            <button className='flex items-center justify-center px-4 py-4 bg-white border-t-4 border-cyan-400' onClick={() => setOpen(!open)}>
                <p className='flex-1 text-2xl font-semibold'>{name}</p>
                <IoChevronDownOutline className={`text-3xl ${open ? '' : 'rotate-180'} transition-all duration-100 ease-in`} />
            </button>
            <div className={`${open ? '' : 'hidden'} flex flex-col`}>
                {
                    enrolleds ?
                        enrolleds.map((studentWallet) => {
                            return <Student key={studentWallet} wallet={studentWallet} subjectData={data} studentsNewMetadata={studentsNewMetadata} setStudentsNewMetadata={setStudentsNewMetadata} />
                        }) : undefined
                }

            </div>
            <button className='px-4 py-2 font-semibold text-blue-700 bg-white border border-blue-500 rounded mt-7 hover:bg-blue-500 hover:text-white hover:border-transparent h-1/2' onClick={sendGrades}>Enviar Notas de {name}</button>

        </div>
    )
}

export default function Professor() {

    const { allSubjects } = useAppContext();

    return (
        <div className='flex flex-col h-screen'>
            <ProfessorNavbar active={"DISCIPLINAS"} />
            <main className='container flex flex-col items-center flex-1 gap-4 p-5 mx-auto sm'>
                {allSubjects.map((subject) => {
                    return <Subject key={subject.code} data={subject} />
                })}

            </main>
        </div>
    )
}
import { createContext, useContext, useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery, useNewMoralisObject } from 'react-moralis';
import { useRouter } from "next/router";
import axios from 'axios';

import AcademicBlock from '../artifacts/contracts/AcademicBlock.sol/AcademicBlock.json';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const AppContext = createContext();

export function AppWrapper({ children }) {

    const { Moralis, account, isWeb3Enabled, web3, enableWeb3 } = useMoralis();

    const { save } = useNewMoralisObject("AddressToName");

    const ethers = Moralis.web3Library;

    const [allSubjects, setAllSubjects] = useState([]);

    const [allProfessors, setAllProfessors] = useState([]);

    const [allUsers, setAllUsers] = useState([]);

    const router = useRouter();

    const getRole = async () => {
        try {

            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));

            const role = await contract.getRole();

            if (role === "University") {
                router.replace("/universidade");
            } else if (role === "Professor") {
                router.replace("/professor");
            } else {
                router.replace("/estudante");
            }

        } catch (error) { console.log(error); }
    }


    const getAllSubjects = async () => {
        try {

            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));

            const response = await contract.getSubjects();

            let subs = [];
            response.forEach(sub => {
                let new_sub = {
                    code: parseInt(sub.code),
                    name: sub.name,
                    credits: parseInt(sub.credits),
                    workload: parseInt(sub.workload),
                    mandatory: sub.mandatory,
                    enrolleds: sub.enrolleds
                };
                subs.push(new_sub);
            });

            setAllSubjects(subs);

        } catch (error) { console.log(error); }
    }

    const saveSubjects = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));
            await contract.createCurriculum(allSubjects);
        } catch (error) { console.log(error) }
    }

    const getAllUsers = async () => {

        const axiosResponse = await axios.get('https://paxhxnbk1dbe.usemoralis.com:2053/server/classes/AddressToName', {
            headers: {
                'X-Parse-Application-Id': 'SWhmGOPHVipf4CzlCHv8j40GpzzdEvnxquyqcB3I',
                'X-Parse-REST-API-Key': 'undefined'
            }
        });
        const allUsersResponse = axiosResponse.data.results;

        setAllUsers(allUsersResponse);

    }

    const getAllProfessors = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));

            const response = await contract.getProfessors();

            let profs = [];
            response.forEach(prof => {
                let new_prof = {
                    wallet: prof.wallet,
                    subjectCodes: prof.subjectCodes.map(sub => { return Number(sub) })
                };
                const prof_database = allUsers.filter(user => { return user.ethAddress === prof.wallet.toLowerCase() })
                if (prof_database.length != 0) {
                    new_prof.name = prof_database[0].name;
                }

                profs.push(new_prof);
            });




            setAllProfessors(profs);

        } catch (error) { console.log(error) }

    }

    const saveProfessors = async () => {
        try {

            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));

            const removedNameProfessors = allProfessors.map((prof) => {
                return { wallet: prof.wallet, subjectCodes: prof.subjectCodes };
            })

            await contract.saveProfessors(removedNameProfessors);

        } catch (error) {
            console.log(error);
        }
    }

    const UploadNFTMetadaNewStudent = async (wallet, ipfsUrl) => {
        try {

            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));

            await contract.safeMint(wallet, ipfsUrl);
        } catch (error) {
            console.log(error);
        }
    }

    const getNFT = async (address) => {
        try {
            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));

            const response = await contract.getNFT(address);

            return response;
        } catch (error) { console.log(error) }
    }

    const enrollStudent = async (subjectCodes) => {
        try {
            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));
            await contract.enrollStudent(subjectCodes);
        } catch (error) { console.log(error) }
    }

    const transferStudentToOtherUniversity = async (studentWallet, universityWallet) => {
        try {

            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));

            await contract.updateStudentToUniversity(studentWallet, universityWallet);
        } catch (error) {
            console.log(error);
        }
    }

    const updateNFTUris = async (wallets, uris, subjectCode) => {
        try {

            const contract = new ethers.Contract(contractAddress, AcademicBlock.abi, web3.getSigner(account));

            await contract.updateNFTUris(wallets, uris, subjectCode);
        } catch (error) {
            console.log(error);
        }

    }

    const nameQuery = useMoralisQuery(
        "AddressToName",
        (query) => query.equalTo("address", account),
        [account],
        { autoFetch: false }
    )

    const saveUserName = async () => {
        const response = await nameQuery.fetch()
        if(response.length===0){
            const data = {
                address: account,
                name: ''
            }
            save(data);
        }

    }

    const prepareContext = async () => {
        try {
            await getAllUsers();
            getAllSubjects();
            getAllProfessors();
            saveUserName();
        } catch (error) { }
    }

    useEffect(() => {
        if (!isWeb3Enabled) {
            enableWeb3();
        } else {
            prepareContext();
        }
    }, [web3]);

    return (
        <AppContext.Provider value={
            {
                allSubjects,
                setAllSubjects,
                saveSubjects,
                allProfessors,
                setAllProfessors,
                saveProfessors,
                UploadNFTMetadaNewStudent,
                transferStudentToOtherUniversity,
                getRole,
                web3,
                getNFT,
                enrollStudent,
                allUsers,
                updateNFTUris
            }
        }>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
import Image from 'next/image'
import PhoneInput from 'react-phone-number-input/input'
import ProfilePicture from '../public/profilePicture.webp';
import { useEffect, useState } from 'react'
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useMoralisFile } from "react-moralis";


export default function ProfilePage() {

    const { user, account } = useMoralis();
    const { saveFile } = useMoralisFile();

    const { fetch } = useMoralisQuery(
        "_User",
        (query) => query.equalTo("objectId", user.id),
        [],
        { autoFetch: false }
    );

    const nameQuery = useMoralisQuery(
        "AddressToName",
        (query) => query.equalTo("address", account),
        [],
        { autoFetch: false }
    )

    const getProfile = async () => {
        const userProfile = await fetch();
        const addressToNameResponse = await nameQuery.fetch();
        setUserProfile(userProfile[0]);
        setAddressToName(addressToNameResponse[0]);
        setName(addressToNameResponse[0].get("name"));
        setMail(userProfile[0].get("email") || '');
        setPhone(userProfile[0].get("phone") || '');
        setPicture(userProfile[0].get("picture") || '');
    }

    useEffect(() => {
        getProfile();
    }, [])


    const [addressToName, setAddressToName] = useState({});
    const [userProfile, setUserProfile] = useState({});
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [phone, setPhone] = useState('');
    const [picture, setPicture] = useState('');

    const saveProfile = async () => {
        if (name != addressToName.get("name")) {
            addressToName.set("name", name);
            addressToName.save();
        };
        if (mail != userProfile.get("email")) { user.set("email", mail) };
        if (phone != userProfile.get("phone")) { user.set("phone", phone) };
        if (picture != userProfile.get('picture')) {
            const ipfs_url = await uploadPictureToIPFS();
            user.set("picture", ipfs_url);
        }
        user.save();

    }

    const uploadPictureToIPFS = async () => {
        let result;
        try {
            result = await saveFile(
                "profile_picture",
                { base64: picture },
                {
                    type: 'base64',
                }
            );

        } catch (error) {
            console.log(error);
        }
        return result._url;

    }


    const onImageChange = (e) => {

        const file = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            setPicture(reader.result);
        }
        reader.readAsDataURL(file);

    }

    return (
        <main className="container flex p-5 mx-auto sm">
            <div className='relative flex flex-col w-3/12 p-3 bg-white border-t-4 border-cyan-400'>
                <div className="border border-gray-300">
                    <Image layout='responsive' width={300} height={300} src={picture || ProfilePicture} />
                </div>
                <p className="my-1 text-xl font-bold leading-8 text-center text-gray-900">{name}</p>
                <label htmlFor='imageInput' className='flex justify-center px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent hover:cursor-pointer'>Trocar imagem
                </label>
                <input id='imageInput' type="file" accept="image/*" onChange={onImageChange} className='hidden' />

            </div>

            <div className='flex flex-col w-9/12 p-4 mx-2 bg-white border-t-4 border-cyan-400'>
                <div className='grid grid-cols-4 grid-rows-2 gap-4'>
                    <div className='col-span-2'>
                        <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900'>Nome</label>
                        <input type='text' id='name' name='name' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={name} onChange={(e) => setName(e.target.value)} placeholder='Nome' />
                    </div>
                    <div className='col-span-2'>
                        <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900'>Email</label>
                        <input type='email' id='email' name='email' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={mail} onChange={(e) => setMail(e.target.value)} placeholder='email@email.com' />
                    </div>
                    <div className='col-span-2 col-start-2'>
                        <label htmlFor='contact' className='block mb-2 text-sm font-medium text-gray-900'>Contato</label>
                        <PhoneInput
                            country='BR'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            name='contact'
                            maxLength='15'
                            placeholder='(xx) xxxxx-xxxx'
                            value={phone}
                            onChange={setPhone} />

                    </div>
                </div>
                <div className='flex items-end justify-center flex-1 mt-4'>
                    <button className='px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent' onClick={saveProfile}>Salvar alterações</button>
                </div>
            </div>
        </main>
    )
}
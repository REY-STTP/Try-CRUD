import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    bidang: string;
}

interface ItemProps {
    image: string;
    name: string;
    email: string;
    bidang: string;
    onPress: () => void;
    onDelete: () => void;
  }

const Item = ({ image, name, email, bidang, onPress, onDelete }: ItemProps) => {
    return(
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={onPress}>
                <Image source={{uri: `https://api.dicebear.com/9.x/adventurer/svg?seed=${image}`}} style={styles.avatar} />
            </TouchableOpacity>
            <View style={styles.desc}>
                <Text style={styles.descName}>{name}</Text>
                <Text style={styles.descEmail}>{email}</Text>
                <Text style={styles.descBidang}>{bidang}</Text>
            </View>
            <TouchableOpacity onPress={onDelete}>
                <Text style={styles.delete}>X</Text>
            </TouchableOpacity>
        </View>
    )
}

const LocalAPI = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [bidang, setBidang] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [button, setButton] = useState("Simpan")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    useEffect(() => {
        getData()
    }, [])

    const submit = () => {
        const data = {
            name,
            email,
            bidang,
        }
        if(button === 'Simpan'){
            Axios.post('http://localhost:3004/users', data)
            .then((res) => {
                console.log('res', res)
                setName("")
                setEmail("")
                setBidang("")
                getData()
            })
        } else if(button === 'Update' && selectedUser) {
            Axios.put(`http://localhost:3004/users/${selectedUser.id}`, data)
            .then((res) => {
                console.log('Res Update: ', res)
                setName("")
                setEmail("")
                setBidang("")
                getData()
                setButton("Simpan")
            })
        }
        
    }

    const getData = () => {
        Axios.get('http://localhost:3004/users')
        .then((res) => {
            console.log('res', res)
            setUsers(res.data)
        })
    }

    const selectItem = (item: User) => {
        console.log("Item Selected.", item)
        setSelectedUser(item)
        setName(item.name)
        setEmail(item.email)
        setBidang(item.bidang)
        setButton("Update")
    }

    const deleteItem = (Item: User) => {
        console.log(Item)
        Axios.delete(`http://localhost:3004/users/${Item.id}`)
        .then((res) => {
            console.log('Res Delete: ', res)
            getData()
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Local API (JSON Server)</Text>
            <Text>Masukkan Anggota TI Meresahkan</Text>
            <TextInput placeholder="Nama Lengkap" style={styles.input} value={name} onChangeText={(value) => setName(value)} />
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={(value) => setEmail(value)} />
            <TextInput placeholder="Bidang" style={styles.input} value={bidang} onChangeText={(value) => setBidang(value)} />
            <Button title={button} onPress={submit} />
            <View style={styles.line} />
            {users.map(user => {
                return <Item 
                            key={user.id} 
                            image={user.bidang} 
                            name={user.name} 
                            email={user.email} 
                            bidang={user.bidang} 
                            onPress={() => selectItem(user)}
                            onDelete={() => {
                                const alert = window.confirm(`Anda yakin akan menghapus ${user.name}`);
                                if (alert) {
                                    console.log(`User ${user.name} berhasil dihapus.`);
                                    deleteItem(user);
                                } else {
                                    console.log(`Hapus user ${user.name} dibatalkan.`);
                                }
                            }
                        }/>
                    }
                )
            }
        </View>
    );
};

export default LocalAPI;

const styles = StyleSheet.create({
    container: {padding: 20},
    textTitle: {textAlign: 'center', marginBottom: 20},
    line: {height: 2, backgroundColor: 'black', marginVertical: 20},
    input: {borderWidth: 1, marginBottom: 12, borderRadius: 25, paddingHorizontal: 18},
    avatar: {width: 80, height: 80, borderRadius: 80},
    itemContainer: {flexDirection: 'row', marginBottom: 20},
    desc: {marginLeft: 18, flex: 1},
    descName: {fontSize: 20, fontWeight: 'bold'},
    descEmail: {fontSize: 16},
    descBidang: {fontSize: 12, marginTop: 8},
    delete: {fontSize: 20, fontWeight: 'bold', color: 'red'}
})
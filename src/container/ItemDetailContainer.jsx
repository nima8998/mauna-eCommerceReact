import React, { useState, useEffect } from 'react'
import ItemDetail from '../Components/ItemDetail'
import CircularProgress from '@material-ui/core/CircularProgress'
import ItemCountContainer from './ItemCountCointainer'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import {useCartContext} from '../Context/CartContext'
import { getFirestore } from '../firebase'

export default function ItemDetailContainer() {

    const [item, setItem] = useState([]);
    const {paramId} = useParams();
    const {addItems} = useCartContext();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const db = getFirestore();
        const getItem = db.collection('items')
        getItem.get()
        .then(dato =>{
            const filter = dato.docs.find(x => x.id === paramId)
            setItem(filter.data())
        })
        },[paramId]);

        // function para agregar el item
        const onAdd = count =>{
            addItems(count, item)
            setShow(true)
        }

    return (
        <ItemDetalContainer>
            {/* info del producto */}
            {
                item.length === 0 ? 
                <CircularProgress color='secondary'/> :
                <ItemDetail props={item}/> 
            }
            {/* componente para agregar cantidad y agregar al carrito */}
            {
                item.length === 0 ?
                null :
                <ItemCountContainer props={item} onAdd={onAdd} show={show} /> 
            }
        </ItemDetalContainer>
    )

}

    const ItemDetalContainer = styled.div`
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-self: center;
        margin: auto;
    `
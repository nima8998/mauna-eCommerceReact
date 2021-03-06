import React, {useState, useEffect} from 'react'
import CartDetail from '../Components/CartDetail'
import CartCheckoutDetail from '../Components/CartCheckoutDetail'
import Login from '../Components/Login'
import {useCartContext} from '../Context/CartContext'
import {useUserContext} from '../Context/UserContext'
import {Link} from 'react-router-dom'
import {device} from '../css/MediaQueries'
import styled from 'styled-components'
import { getFirestore } from '../firebase'
import firebase from 'firebase/app'

export default function CartContainer() {

    const db = getFirestore()
    const orders = db.collection('orders')
    const {clearItems, itemCart, total} = useCartContext()
    const {userLogged} = useUserContext()
    const [newBuy, setnewBuy] = useState([])
    const [show, setShow] = useState(true)

    useEffect(()=>{
       if (itemCart.length > 0) {
           setShow(false)
       }else{
           setShow(true)
       }
    }, [itemCart])

    const buy = () =>{
        let order = {
            buyer: {
                name: localStorage.getItem('user_name'),
                email: localStorage.getItem('user_email')
            },
            items: itemCart,
            tdate: firebase.firestore.Timestamp.fromDate(new Date()),
            total: total()
        }

        itemCart.length &&
        orders.add(order)
            .then((id)=>{
                setnewBuy(id)
                clearItems()
            })
            .catch((err)=>{
                console.log('Error en la compra: ', err)
            }) 

    }

    
    return (
        <Container>

            <CartList>
                {
                    itemCart.length > 0 ? itemCart.map(item=> (
                        <CartDetail key={item.id} props={item}/>
                    )) :

                        <h1> Carrito vacío ¡Revisá nuestra <Link to='/'>tienda</Link>!</h1>
                }
            </CartList>

            <CartCheckout>
                {
                    userLogged === undefined ? <Login message='Logueate para finalizar tu compra'/> : <CartCheckoutDetail handlerBuy={buy} newBuy={newBuy} show={show}/>
                }
            </CartCheckout>

        </Container>
    )
    
}

const Container = styled.article`
    height: 100%;
    display: flex;
    margin: auto;
    width: 65%;

    @media ${device.mobile}{
        width: 100vw;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
            width: 5em;
        }
    }

    @media ${device.tablet}{
        width: 100vw;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img{
            width: 15em;
        }
    }
    
    @media ${device.desktop}{
        img{
            width: 20em;
        }
    }
`

const CartList = styled.section`
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    text-align: center;

    a{
        color: #f50057;
        text-decoration: none;
    }
`

const CartCheckout = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
`
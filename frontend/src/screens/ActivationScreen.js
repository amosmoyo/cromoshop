import React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {useParams, Link} from 'react-router-dom'
import {activateEmail} from '../redux/authSlice';
import Loader from '../components/Loading';
import Message from '../components/Message';

const ActivationScreen = () => {
    const {activation_token} = useParams();

    const dispatch = useDispatch()

    const { loading, error, message, success } = useSelector(
        (state) => state.authReducers
    );

    console.log(activation_token)

    React.useEffect(() => {
        if(activation_token) {
            dispatch(activateEmail(activation_token))
        }
    }, [dispatch, activation_token])
  return (
    <>
    {loading && <Loader />}
    {error && <Message variant="danger">{error}</Message>}
    <div className='text-center mt-5 pt-5' >
    {success && <><p style={{fontWeight: "bold", fontSize: '1.3rem'}}> {message} click here <Link className='btn btn-success' to="/login">sign in </Link> to login</p></>}
    </div>
    </>
  )
}

export default ActivationScreen
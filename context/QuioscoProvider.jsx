import { useState, useEffect, createContext } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const QuioscoContext = createContext();

const QuioscoProvider = ({children}) => {

    const [categorias, setCategorias] = useState([])
    const [categoriaActual, setCategoriaActual] = useState({})
    const [producto, setProducto] = useState({})
    const [modal, setModal] = useState(false)
    const [pedido, setPedido] = useState([])
    const [nombre, setNombre] = useState('')
    const [total, setTotal] = useState(0)

    const router = useRouter()

    //Conexion BD y arreglo de categorias 
    const obtenerCategorias = async () => {
        const {data} = await axios('/api/categorias')
        setCategorias(data)
    }

    useEffect(()=> {
        obtenerCategorias()
    }, [])

    //Calculo de Total - se utiliza useEffect para actualizar mediante cambios en las ordenes
    useEffect(()=> {
        const nuevoTotal = pedido.reduce((total, producto) => (producto.precio * producto.cantidad) + total, 0)
        setTotal(nuevoTotal)
    }, [pedido])


    //Define una categoria por default
    useEffect(()=>{
        setCategoriaActual(categorias[0])
    }, [categorias])

    //Conocer categoria seleccionada mediante id
    const handleClickCategoria = id => {
        const categoria = categorias.filter( cat => cat.id === id)
        setCategoriaActual(categoria[0])
        router.push('/')
    }

    //Setear a producto que se selecciona
    const handleSetProducto = producto => {
        setProducto(producto)
    }

    //Crea modal para agregar productos
    const handleChangeModal = () => {
        setModal(!modal)
    }

    //Crea arreglo de productos en array pedido
    const handleAgregarPedido = ({categoriaId, ...producto}) => {
        
        //Para correr arreglo y ver si nuevo item agregado ya existe
        if(pedido.some(productoState => productoState.id === producto.id)){
            const pedidoActualizado = pedido.map(productoState => productoState.id === producto.id ? producto : productoState)
            setPedido(pedidoActualizado)
            toast.success('Pedido Actualizado')
        }else {
            setPedido([...pedido, producto])
            toast.success('Agregado al Pedido')
        }

        setModal(false)
    }

    //Para editar cantidades desde pagina Resumen
    const handleEditarCantidades = id => {
        const productoActualizar = pedido.filter( producto => producto.id === id)
        setProducto(productoActualizar[0])

        setModal(!modal)
    }

    //Eliminar producto
    const handleEliminarProducto = id => {
        const pedidoActualizado= pedido.filter( producto => producto.id !== id)
        setPedido(pedidoActualizado)
    }

    //ColocarOrden - async porque interactua con la API
    const colocarOrden = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/api/ordenes', {pedido, nombre, total, fecha: Date.now().toString()})

            //Resetear la app 
            setCategoriaActual(categorias[0])
            setPedido([])
            setNombre('')
            setTotal(0)
        
            //mensaje de pedido correctamente
            toast.success('Pedido Realizado Correctamete')

            //Timer con redireccion a pagina de inicio
            setTimeout(()=>{
                router.push('/')
            }, 3000)

        } catch (error){
            console.log(error)
        }
    }

    return(
        <QuioscoContext.Provider
            value={{
                categorias,
                categoriaActual,
                handleClickCategoria,
                producto,
                handleSetProducto,
                modal,
                handleChangeModal,
                handleAgregarPedido,
                pedido,
                handleEditarCantidades,
                handleEliminarProducto,
                nombre,
                setNombre, 
                colocarOrden,
                total
            }}
        >
            {children}
        </QuioscoContext.Provider>
    )

}

export {
    QuioscoProvider
}

export default QuioscoContext;
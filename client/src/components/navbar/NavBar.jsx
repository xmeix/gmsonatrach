import './NavBar.css'
const NavBar = () => {
  return(
    <div className='navbar'>
      <ul className='list'>
      <a href="/#">  TABLEAU DE BORD</a>
       <div className='sublist'> 
        <li> <a href="/#">  Planification</a></li>
        <li> <a href="/#">  Gestion Des Mission</a></li>
        <li> <a href="/#">  Gestion Des Employes</a></li>
        <li> <a href="/#">  Gestion Service Relex</a></li>
        <li> <a href="/#">  Gestion C/M/RFM</a></li>
       </div>
      </ul>
      <div className='logout'>
       <button type= "button"> Logout </button>
      </div>
          
    </div>
  )
}
export default NavBar;
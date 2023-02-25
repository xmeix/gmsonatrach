import { NavLink } from 'react-router-dom';
 import './MenuBar.css';
const MenuBar = ({titles}) => {
    return ( 
        <ul className="menuBar">
                
                <li>
                    <NavLink to="/" className="link a"  exact>
                        Tableau de bord
                    </NavLink>
                </li>
                
        {titles.map((title,i) => 
            <li key={i}>
                <NavLink to={title.path} className="link a">
                    {title.title}
                </NavLink>
            </li>)}
        </ul>
     );
}
 
export default MenuBar;
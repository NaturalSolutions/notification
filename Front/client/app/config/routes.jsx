import GenGrille from '../grid/GenGrille.jsx'
import Vignettes from '../components/Vignettes.jsx'
import Details from '../components/Details.jsx'
import App from '../components/app.jsx'
import NotFound from '../components/NotFound.jsx'


const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Vignettes },
  childRoutes: [
	//{ path: 'infos', component: Vignettes },
    { path: 'infos/:Fk_Alerte', component: GenGrille },
    { path: 'infos/:Fk_Alerte/:id' , component : Details },
    { path: '*' , component : NotFound },

  ]
}

module.exports = routes;

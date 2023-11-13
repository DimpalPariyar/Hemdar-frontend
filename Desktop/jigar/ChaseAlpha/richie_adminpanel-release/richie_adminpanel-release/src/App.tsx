// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
// import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';

// auth provider
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    {/* <RTLLayout> */}
    <ScrollTop>
      <AuthProvider>
        <>
          <Routes />
          <Snackbar />
        </>
      </AuthProvider>
    </ScrollTop>
    {/* </RTLLayout> */}
  </ThemeCustomization>
);

export default App;

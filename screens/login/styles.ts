import { StyleSheet } from 'react-native';
import { primaryColor, secondaryColor } from "common/utils"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor
  },
  cornerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    zIndex: 21
  },
  background: {
    flex: 1,
    backgroundColor: primaryColor,
    width: "100%"
  },
  logo: {
    width: 175,
    height: 150,
    resizeMode: "contain"
  },
  tagline: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  logoArea: {
    height: 300,
    paddingTop: 50,
    width: "100%",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 21,
  },
  topBackground: {
    backgroundColor: "white",
    position: "absolute",
    top: -1200,
    left: -550,
    height: 1500,
    width: 1500,
    borderRadius: 750,
    zIndex: 20
  },
  formArea: {
    backgroundColor: "transparent",
    marginTop: 20,
    padding: 20,
  },
  input: {
    width: "100%",
    marginBottom: 30,
  },
  title: {
    fontSize: 35,
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 30,
    color: "white",
  },
  button: {
    alignItems: "center",
    backgroundColor: secondaryColor,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: "black",
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 20,
  },
  unConfirmedUserView: {
    backgroundColor: "transparent"
  }
});

export default styles;

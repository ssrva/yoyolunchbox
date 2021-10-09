import { StyleSheet } from "react-native"
import { primaryColor, secondaryColor, COLORS } from "../../commonUtils"

const styles = StyleSheet.create({
  mainViewStyle: {
    paddingTop: 0,
    padding: 15,
    flex: 1,
    backgroundColor: "white"
  },
  headerWelcome: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 5,
    borderColor: COLORS.GRAY70,
    borderWidth: 1,
    borderRadius: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 50,
  },
  login: {
    flex: 1,
    alignItems: "center",
  },
  ordersPageMainView: {
    backgroundColor: "white",
    flex: 1,
  },
  ordersContainer: {
    backgroundColor: "white",
    flex: 1,
    marginTop: 20,
    display: "flex",
  },
  sectionHeader: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
    padding: 10,
    marginBottom: 10,
    marginTop: 0,
    backgroundColor: COLORS.GRAY95,
    borderRadius: 5,
    textTransform: "uppercase",
    overflow: "hidden"
  },
  button: {
    alignItems: "center",
    backgroundColor: COLORS.GRAY95,
    marginLeft: 20,
    marginRight: 20,
    padding: 5,
    borderRadius: 5,
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    backgroundColor: "white",
    borderTopColor: "#F1F1F1",
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    marginLeft: -15,
    marginRight: -15,
  },
  confirmButton: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: COLORS.GRAY60,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.0,
    elevation: 1,
    textTransform: "uppercase",
    textAlign: "center",
    backgroundColor: "green",
    borderRadius: 4,
  },
  confirmOrderText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  mainButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: secondaryColor,
    borderColor: secondaryColor,
  }
})

export default styles

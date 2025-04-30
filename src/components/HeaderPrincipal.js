import React from "react";
import { View, Image, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const HeaderPrincipal = () => {
  return (
    <View style={styles.header}>
      <Image source={require("../img/logo-senai1.png")} style={styles.logo} resizeMode="contain" />
      <View>
        <View>
          <MaterialCommunityIcons name="account-circle" size={45} color="#555" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "#D3D3D3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 250,
    height: 500,
    resizeMode: "contain",
  },
});

export default HeaderPrincipal;
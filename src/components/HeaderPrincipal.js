import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {useNavigation} from "@react-navigation/native"


const HeaderPrincipal = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Image
        source={require("../img/logo-senai1.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
            <MaterialCommunityIcons
              name="account-circle"
              size={45}
              color="#555"
            />
          </TouchableOpacity>
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

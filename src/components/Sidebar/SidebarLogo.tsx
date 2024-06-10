import { Image, Stack } from "@chakra-ui/react";
import Logo from "assets/img/Stationnex.png";

const SidebarLogo = () => {
  return (
    <Stack direction="column" spacing="12px" align="center" justify="center">
      <Image src={Logo} height="100" />
    </Stack>
  );
};

export default SidebarLogo;

import {HamburgerIcon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {SidebarProps} from "common/react-props";
import IconBox from "components/Icons/IconBox";
import {renderThumbLight, renderTrack, renderView,} from "components/Scrollbar/Scrollbar";
import {HSeparator} from "components/Separator/Separator";
import SidebarHelp from "components/Sidebar/SidebarHelp";
import React, {FC, Fragment, useRef} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import {NavLink, useLocation} from "react-router-dom";
import {useAuth} from "store/AuthContext";

// Shared constants and styles
const SIDEBAR_STYLES = {
  activeBg: "white",
  inactiveBg: "white",
  activeColor: "gray.700",
  inactiveColor: "gray.400",
  sidebarActiveShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)",
  sidebarBackgroundColor: "#012249",
  variantChange: "0.2s linear",
};

// Shared hook for active route detection
const useActiveRoute = () => {
  const location = useLocation();
  return (routeName: string) => location.pathname.startsWith(routeName) ? "active" : "";
};

// Shared component for creating links
const useSidebarLinks = (routes: any, isSignedIn?: boolean) => {
  const activeRoute = useActiveRoute();
  const [state, setState] = React.useState<{ [key: string]: boolean }>({});

  const createLinks = (routes: any) => {
    const routesArray = Object.values(routes);
    return routesArray.map((prop: any, key: number) => {
      if (isSignedIn && prop.publicRoute) return null;
      if (prop.hideInNavbar || prop.redirect) return null;

      if (prop.category) {
        const st = { ...state, [prop.state!]: !state[prop.state!] };
        return (
            <Fragment key={key}>
              <Text
                  color={SIDEBAR_STYLES.activeColor}
                  fontWeight="bold"
                  mb={{ xl: "6px" }}
                  mx="auto"
                  ps={{ sm: "10px", xl: "16px" }}
                  py="12px"
              >
                {prop.name}
              </Text>
              {createLinks(prop.views!)}
            </Fragment>
        );
      }

      const isActive = activeRoute(prop.layout + prop.path) === "active";
      const buttonProps = {
        boxSize: "initial",
        justifyContent: "flex-start",
        alignItems: "center",
        mb: { xl: "6px" },
        mx: { xl: "auto" },
        ps: { sm: "10px", xl: "16px" },
        py: "12px",
        borderRadius: "15px",
        w: "100%",
        _active: {
          bg: "inherit",
          transform: "none",
          borderColor: "transparent",
        },
        _focus: {
          boxShadow: isActive ? SIDEBAR_STYLES.sidebarActiveShadow : "none",
        },
      };

      return (
          <NavLink to={prop.layout + prop.path} key={key}>
            <Button
                {...buttonProps}
                bg={isActive ? SIDEBAR_STYLES.activeBg : "transparent"}
                boxShadow={isActive ? SIDEBAR_STYLES.sidebarActiveShadow : undefined}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                ) : (
                    <IconBox
                        bg={isActive ? "blue.500" : SIDEBAR_STYLES.inactiveBg}
                        color={isActive ? "white" : "blue.500"}
                        h="30px"
                        w="30px"
                        me="12px"
                        transition={SIDEBAR_STYLES.variantChange}
                    >
                      {prop.icon}
                    </IconBox>
                )}
                <Text
                    color={isActive ? SIDEBAR_STYLES.activeColor : SIDEBAR_STYLES.inactiveColor}
                    my="auto"
                    fontSize="sm"
                >
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          </NavLink>
      );
    });
  };

  return createLinks(routes);
};

const Brand = ({ logo, pt = "25px" }: { logo: React.ReactNode; pt?: string }) => (
    <Box pt={pt} mb={pt === "25px" ? "12px" : "8px"}>
      {logo}
      <HSeparator my="26px" />
    </Box>
);

export const Sidebar = (props: SidebarProps) => {
  const { isSignedIn } = useAuth();
  const { logo, routes, sidebarVariant } = props;
  const mainPanel = useRef<HTMLDivElement>(null);
  const links = useSidebarLinks(routes, isSignedIn);

  return (
      <Box ref={mainPanel}>
        <Box
            bgImage="white"
            bg="#FFFFFF"
            display={{ base: "none", xl: "block" }}
            position="fixed"
        >
          <Box
              bg={SIDEBAR_STYLES.sidebarBackgroundColor}
              transition={SIDEBAR_STYLES.variantChange}
              w="260px"
              maxW="260px"
              ms={{ sm: "16px" }}
              my={{ sm: "16px" }}
              h="calc(100vh - 32px)"
              ps="20px"
              pe="20px"
              m="0px"
              filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
              borderRadius="20px"
              display={{ base: "none", xl: "block" }}
          >
            <Text fontSize="x-small" fontWeight="bold" color="blue.600" textAlign="end">
              {process.env.REACT_APP_VERSION}
            </Text>
            <Scrollbars
                autoHide
                renderTrackVertical={renderTrack}
                renderThumbVertical={renderThumbLight}
                renderView={renderView}
            >
              <Box><Brand logo={logo} /></Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
              </Stack>
              <SidebarHelp sidebarVariant={sidebarVariant} />
            </Scrollbars>
          </Box>
        </Box>
      </Box>
  );
};

export const SidebarResponsive: FC<SidebarProps> = (props) => {
  const { logo, routes, hamburgerColor, ...rest } = props;
  const mainPanel = useRef<HTMLDivElement>(null);
  const links = useSidebarLinks(routes);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<SVGSVGElement>(null);

  return (
      <Flex display={{ sm: "flex", xl: "none" }} ref={mainPanel} alignItems="center">
        <HamburgerIcon
            color={hamburgerColor}
            w="28px"
            h="28px"
            ref={btnRef}
            onClick={onOpen}
        />
        <Drawer isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent
              w="250px"
              maxW="250px"
              ms={{ sm: "16px" }}
              my={{ sm: "16px" }}
              borderRadius="16px"
              bg={SIDEBAR_STYLES.sidebarBackgroundColor}
          >
            <DrawerCloseButton _focus={{ boxShadow: "none" }} _hover={{ boxShadow: "none" }} />
            <DrawerBody maxW="250px" px="1rem">
              <Box maxW="100%" h="100vh">
                <Box><Brand logo={logo} pt="35px" /></Box>
                <Stack direction="column" mb="40px">
                  <Box>{links}</Box>
                </Stack>
                <SidebarHelp />
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
  );
};

export default Sidebar;
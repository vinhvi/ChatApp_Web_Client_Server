import { ViewIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { Stack } from "@chakra-ui/layout";
import { Divider } from "@chakra-ui/react";
import { Input, InputLeftElement, InputGroup } from "@chakra-ui/input";
import { PhoneIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Radio, RadioGroup } from "@chakra-ui/react";

const UpdateProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setUserId] = useState(user._id);
  const [name, setName] = useState(user.name);
  const [pic, setPic] = useState();
  const [birth, setBirth] = useState(user.birth);
  const [sex, setsex] = useState(user.sex.toString());
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleTimeSend = () => {
    const x = new Date(birth);
    // console.log(birth);
    const month =
      x.getMonth() + 1 < 10 ? "0" + (x.getMonth() + 1) : x.getMonth() + 1;
    const date =x.getDate() < 10 ? "0" + (x.getDate()) : x.getDate() ;
    const a = x.getFullYear() + "-" + month+"-" + date;
    // console.log(a);
    return a;
  };

  const updateProfile = async () => {
    setLoading(true);

    var DatePresent = new Date().getFullYear();
    var birhtUser = new Date(birth).getFullYear();
    if (name.length <= 0) {
      toast({
        title: "Please Enter your name ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    // console.log(DatePresent - birhtUser);
    if (DatePresent - birhtUser < 0) {
      toast({
        title: "Age > 0",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      // console.log("sex", sex);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/updateProfile",
        {
          userId,
          name,
          sex,
          birth,
          pic,
        },
        config
      );
      localStorage.removeItem("userInfo");
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "Update Success",
        status: "success",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<InfoOutlineIcon />}
          onClick={onOpen}
        />
      )}
      <Modal
        // scrollBehavior={scrollBehavior}
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
        // isCentered
        // height="1300px"
        // styleConfig={{outerHeight:"5000px"}}
      >
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          ></ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button>
              <Image
                borderRadius="full"
                boxSize="100px"
                src={user.pic}
                alt={user.name}
              />
            </Button>
            <FormControl id="first-name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="birthday" isRequired>
              <FormLabel>Birthday</FormLabel>
              <Input
                type="date"
                value={handleTimeSend()}
                // placeholder={handleTimeSend(user.birth)}
                onChange={(e) => {
                  // console.log(e.target.value);
                  setBirth(e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="sex" isRequired>
              <FormLabel>Sex</FormLabel>
              <RadioGroup value={sex} onChange={setsex}>
                <Stack direction="row">
                  <Radio colorScheme="green" value="1">
                    Male
                  </Radio>
                  <Radio colorScheme="green" value="2">
                    Female
                  </Radio>
                  <Radio colorScheme="green" value="3">
                    Other
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Close
            </Button>
            <Button onClick={updateProfile} colorScheme="green">
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateProfileModal;

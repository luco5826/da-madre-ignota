<script>
  import { onMount } from "svelte";

  import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";

  export let open;
  export let toggleModal, onCompleteOrder;

  let userInfos = { name: "", email: "", phone: "" };
  onMount(() => {
    const savedInfos = localStorage.getItem("userinfos");
    if (savedInfos) {
      userInfos = JSON.parse(savedInfos);
    }
  });

  const completeOrder = () => {
    // TODO: Form validation

    localStorage.setItem("userinfos", JSON.stringify(userInfos));
    onCompleteOrder(userInfos);
  };
</script>

<Modal isOpen={open} toggle={toggleModal}>
  <ModalHeader>Ordina</ModalHeader>
  <ModalBody>
    <Form>
      <FormGroup>
        <Label>Nome e cognome</Label>
        <Input
          type="text"
          placeholder="Il tuo nome e cognome"
          bind:value={userInfos.name}
        />
      </FormGroup>
      <FormGroup>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="La tua email"
          bind:value={userInfos.email}
        />
      </FormGroup>
      <FormGroup>
        <Label>Telefono</Label>
        <Input
          type="text"
          placeholder="Il tuo numero di telefono"
          bind:value={userInfos.phone}
        />
      </FormGroup>
    </Form>
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={toggleModal}>Annulla</Button>
    <Button color="primary" on:click={completeOrder}>Ordina</Button>
  </ModalFooter>
</Modal>

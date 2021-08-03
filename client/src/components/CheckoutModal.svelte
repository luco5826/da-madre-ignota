<script>
  import { onMount } from "svelte";

  import {
    Alert,
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
  import { isNullOrEmpty, isValidEmail } from "../Utils";

  export let open;
  export let toggleModal, onCompleteOrder;

  let userInfos = { name: "", email: "", phone: "" };
  let formError = undefined;

  onMount(() => {
    const savedInfos = localStorage.getItem("userinfos");
    if (savedInfos) {
      userInfos = JSON.parse(savedInfos);
    }
  });

  const completeOrder = () => {
    if (
      isNullOrEmpty(userInfos.name) ||
      isNullOrEmpty(userInfos.email) ||
      isNullOrEmpty(userInfos.phone)
    ) {
      formError = "Tutti i campi sono necessari";
      return;
    }

    if (!isValidEmail(userInfos.email)) {
      formError = "La mail inserita non è valida";
      return;
    }

    localStorage.setItem("userinfos", JSON.stringify(userInfos));
    onCompleteOrder(userInfos);
  };
</script>

<Modal isOpen={open} toggle={toggleModal}>
  <ModalHeader>Ordina</ModalHeader>
  <ModalBody>
    <Form>
      <FormGroup>
        <Label>Nome e cognome<span class="text-danger mx-1">*</span></Label>
        <Input
          type="text"
          placeholder="Il tuo nome e cognome"
          bind:value={userInfos.name}
        />
      </FormGroup>
      <FormGroup>
        <Label>Email<span class="text-danger mx-1">*</span></Label>
        <Input
          type="email"
          placeholder="La tua email"
          bind:value={userInfos.email}
        />
      </FormGroup>
      <FormGroup>
        <Label>Telefono<span class="text-danger mx-1">*</span></Label>
        <Input
          type="text"
          placeholder="Il tuo numero di telefono"
          bind:value={userInfos.phone}
        />
      </FormGroup>
    </Form>
    {#if formError}
      <Alert color="danger">{formError}</Alert>
    {/if}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={toggleModal}>Annulla</Button>
    <Button color="primary" on:click={completeOrder}>Ordina</Button>
  </ModalFooter>
</Modal>

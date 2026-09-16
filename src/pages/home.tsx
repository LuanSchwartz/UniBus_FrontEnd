import { Flex, Text } from "@nexpy/design-system";

export function Home() {
  return (
    <Flex>
      <Flex direction="column" bg="#132A4D" align="center" justify="center" gap="16px" p="32px" w="100%">
        <Flex direction="row" align="center" justify="space-between">
            <Flex direction="column" align="start" justify="start">
                <Text as="h1" color="white">
                  Olá, Ana!
                </Text>
                <Text as="subheading" color="#CBD5E1">
                  Confira suas próximas viagens.
                </Text>
            </Flex>
        </Flex>

        </Flex>
    </Flex>
  );
}
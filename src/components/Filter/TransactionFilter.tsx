import {ArrowDownIcon} from "@chakra-ui/icons";
import {Button, Checkbox, Flex, Input, Menu, MenuButton, MenuList, Text,} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../store/AuthContext";
import {Filter} from "../../common/model";
import {useCard} from "../../hooks/use-transaction";
import {useProduct} from "hooks/use-product";
import {useSalePoint} from "../../hooks/use-sale-point";

type TransactionFilterProps = {
  onChange: (filter: Filter) => void;
};

const filterInitValue: Filter = {
  cardIds: [],
  salePointIds: [],
  productIds: [],
  city: [],
  period: { from: "", to: "" },
};

const TransactionFilter = ({ onChange }: TransactionFilterProps) => {
  const { customerId } = useAuth();
  const { supplierId } = useAuth();

  const { cards, isLoading } = useCard(customerId);

  const { salepoint } = useSalePoint(Number(supplierId));
  const { product } = useProduct(supplierId);
  const { t } = useTranslation();

  const [filter, setFilter] = useState<Filter>(filterInitValue);

  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange(filter);
  }, [filter, onChange]);

  const updateHandler = (
    key: keyof Filter,
    id: number | string,
    checked: boolean,
  ) => {
    setFilter((prev) => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] as Array<number | string>), id]
        : (prev[key] as Array<number | string>).filter((i) => i !== id),
    }));
  };

  const updatePeriod = () => {
    const from = fromRef.current?.value;
    const to = toRef.current?.value;

    setFilter((prev) => ({
      ...prev,
      period: {
        from: from ?? "",
        to: to ?? "",
      },
    }));
  };

  const clearHandler = () => {
    setFilter(filterInitValue);
  };

  return (
    <Flex gap={4} alignItems="center" position="relative">
      <Text>{t("filter.filterBy")}</Text>
      <Menu>
        <MenuButton
          variant="outline"
          fontWeight="normal"
          as={Button}
          rightIcon={<ArrowDownIcon />}
        >
          {t("filter.cardId")}
          {filter.cardIds.length > 0 ? ` (${filter.cardIds.length})` : null}
        </MenuButton>
        <MenuList zIndex="2">
          <Flex flexDirection="column" gap={5} p="10px 20px">
            {cards &&
              cards.map((a, index) => (
                <Checkbox
                  key={index}
                  isChecked={filter.cardIds.includes(+a.id!)}
                  onChange={({ target }) =>
                    updateHandler("cardIds", +a.id!, target.checked)
                  }
                >
                  {a.cardId}
                </Checkbox>
              ))}
          </Flex>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          variant="outline"
          fontWeight="normal"
          as={Button}
          rightIcon={<ArrowDownIcon />}
        >
          {t("filter.station")}
          {filter.salePointIds.length > 0
            ? ` (${filter.salePointIds.length})`
            : null}
        </MenuButton>
        <MenuList zIndex="2">
          <Flex flexDirection="column" gap={5} p="10px 20px">
            {salepoint &&
              salepoint.map((f, index) => (
                <Checkbox
                  key={index}
                  isChecked={filter.salePointIds.includes(+f.id!)}
                  onChange={({ target }) =>
                    updateHandler("salePointIds", +f.id!, target.checked)
                  }
                >
                  {f.name}
                </Checkbox>
              ))}
          </Flex>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          variant="outline"
          fontWeight="normal"
          as={Button}
          rightIcon={<ArrowDownIcon />}
        >
          {t("filter.product")}
          {filter.productIds.length > 0
            ? ` (${filter.productIds.length})`
            : null}
        </MenuButton>
        <MenuList zIndex="2">
          <Flex flexDirection="column" gap={5} p="10px 20px">
            {product &&
              product.map((p, index) => (
                <Checkbox
                  key={index}
                  isChecked={filter.productIds.includes(+p.id!)}
                  onChange={({ target }) =>
                    updateHandler("productIds", +p.id!, target.checked)
                  }
                >
                  {p.name}
                </Checkbox>
              ))}
          </Flex>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          variant="outline"
          fontWeight="normal"
          as={Button}
          rightIcon={<ArrowDownIcon />}
        >
          {t("filter.city")}
          {filter.city.length > 0 ? ` (${filter.city.length})` : null}
        </MenuButton>
        <MenuList zIndex="2">
          <Flex flexDirection="column" gap={5} p="10px 20px">
            {salepoint &&
              salepoint.map((f, index) => (
                <Checkbox
                  key={index}
                  isChecked={filter.city.includes(f.city!)}
                  onChange={({ target }) =>
                    updateHandler("city", f.city!, target.checked)
                  }
                >
                  {f.city}
                </Checkbox>
              ))}
          </Flex>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          variant="outline"
          fontWeight="normal"
          as={Button}
          rightIcon={<ArrowDownIcon />}
        >
          {t("filter.period")}
        </MenuButton>
        <MenuList zIndex="2">
          <Flex flexDirection="column" gap={5} p="10px 20px 20px">
            <Text fontWeight="semibold">{t("filter.from")}:</Text>
            <Input
              value={filter.period.from}
              ref={fromRef}
              onChange={updatePeriod}
              type="datetime-local"
            />
            <Text fontWeight="semibold">{t("filter.to")}:</Text>
            <Input
              min={filter.period.from}
              value={filter.period.to}
              ref={toRef}
              onChange={updatePeriod}
              type="datetime-local"
            />
          </Flex>
        </MenuList>
      </Menu>
      <Button colorScheme="blue" onClick={clearHandler}>
        {t("filter.clear")}
      </Button>
    </Flex>
  );
};

export default TransactionFilter;

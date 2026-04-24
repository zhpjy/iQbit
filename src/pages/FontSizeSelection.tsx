import React, { useEffect, useMemo, useState } from "react";
import { useIsLargeScreen } from "../utils/screenSize";
import PageHeader from "../components/PageHeader";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  LightMode,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useFontSizeContext } from "../components/FontSizeProvider";
import { Input } from "@chakra-ui/input";
import { zhCN } from "../locales/zh-CN";

export interface FontSizeSelectionProps {}

const amounts = {
  "超小": 15,
  "极小": 25,
  "较小": 60,
  "小": 70,
  "偏小": 80,
  "中偏小": 90,
  "中等（默认）": 100,
  "中偏大": 110,
  "偏大": 120,
  "大": 130,
  "更大": 140,
  "很大": 150,
  "超大": 175,
  "巨大": 200,
};

const CUSTOM_OPTION = "custom";

const FontSizeSelection = (props: FontSizeSelectionProps) => {
  const isLarge = useIsLargeScreen();
  const { scale, setScale } = useFontSizeContext();

  const wantsCustom = useDisclosure();
  const [customValue, setCustomValue] = useState(scale);

  const value = useMemo(() => {
    const isPreset = Object.values(amounts).includes(scale);

    if (isPreset) {
      return scale;
    } else {
      return CUSTOM_OPTION;
    }
  }, [scale]);

  useEffect(() => {
    const isPreset = Object.values(amounts).includes(scale);

    if (!isPreset) {
      wantsCustom.onOpen();
    }
    //  eslint-disable-next-line
  }, []);

  const onChange = (value: string | number) => {
    if (typeof value === "number") {
      wantsCustom.onClose();
      setScale(value);
    } else {
      if (value === CUSTOM_OPTION) {
        wantsCustom.onOpen();
      } else {
        setScale(parseInt(value));
      }
    }
  };

  return (
    <>
      {isLarge && <PageHeader title={zhCN.fontSize.title} />}
      <Flex flexDirection={"column"} gap={5}>
        <FormControl>
          <Flex justifyContent={"space-between"}>
            <FormLabel>{zhCN.fontSize.selectFontSize}</FormLabel>
            {value !== 100 && (
              <Button
                variant={"ghost"}
                size={"xs"}
                colorScheme={"blue"}
                onClick={() => onChange(100)}
              >
                {zhCN.fontSize.resetDefault}
              </Button>
            )}
          </Flex>
          <Select value={value} onChange={(e) => onChange(e.target.value)}>
            <optgroup label={zhCN.fontSize.selectSize}>
              {Object.entries(amounts).map(([key, val]) => (
                <option key={key} value={val}>
                  {key}
                </option>
              ))}
            </optgroup>
            <optgroup label={zhCN.fontSize.enterYourOwnSize}>
              <option value={CUSTOM_OPTION}>{zhCN.fontSize.custom}</option>
            </optgroup>
          </Select>
          <FormHelperText>{zhCN.fontSize.presetApplied}</FormHelperText>
        </FormControl>
        {wantsCustom.isOpen && (
          <FormControl>
            <FormLabel>{zhCN.fontSize.enterCustomScale}</FormLabel>
            <Flex gap={3}>
              <Input
                type={"number"}
                value={customValue}
                onChange={(e) => setCustomValue(parseInt(e.target.value))}
              />
              <LightMode>
                <Button
                  colorScheme={"blue"}
                  px={8}
                  onClick={() => onChange(customValue)}
                >
                  {zhCN.common.apply}
                </Button>
              </LightMode>
            </Flex>
          </FormControl>
        )}
      </Flex>
    </>
  );
};

export default FontSizeSelection;

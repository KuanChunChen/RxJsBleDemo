/**
 * payload 格式： « 16進位
 * Write => netID ("%02X") + function code ("%02X")+ modbus address ("%04X") + length ("%02X") =>要寫入的16進位數字 '位數' + write data + CRC
 * Read => netID ("%02X") + function code ("%02X") + modbus address ("%04X") + length ("%04X") =>要讀取的byte長度 + CRC
 *
 * Net ID default = 1
 */

/**
 * TODO
 * 目前payload maker仍有問題
 * 修復中
 * */
export const makePayload = (
  netID: Number = 1,
  functionCode: FunctionCodeEnum,
  modbusAddress: Number,
  length: Number,
  writeDate: String = null,
) => {
  let hexNetID = dec2Hex(1, 2);
  let hexFunctionCode = dec2Hex(functionCode.valueOf(), 2);
  let hexAddress = dec2Hex(modbusAddress, 4);
  let prePayload = hexNetID + hexFunctionCode + hexAddress;
  switch (functionCode.valueOf()) {
    case FunctionCodeEnum.FUNCTION_ID_READ_COIL_STATUS:
    case FunctionCodeEnum.FUNCTION_ID_READ_INPUT_STATUS:
    case FunctionCodeEnum.FUNCTION_ID_READ_HOLDING_REGISTER:
    case FunctionCodeEnum.FUNCTION_ID_READ_INPUT_REGISTER:
      let hexReadLength = dec2Hex(length, 4);
      let middleReadPayload = prePayload + hexReadLength;
      let crcRead = getCrcString(middleReadPayload);
      return middleReadPayload + crcRead;

    case FunctionCodeEnum.FUNCTION_ID_WRITE_SINGLE_COILS:
    case FunctionCodeEnum.FUNCTION_ID_WRITE_SINGLE_REGISTER:
    case FunctionCodeEnum.FUNCTION_ID_WRITE_MULTIPLE_COILS:
    case FunctionCodeEnum.FUNCTION_ID_WRITE_MULTIPLE_REGISTER:
      let hexWriteLength = dec2Hex(length * 2, 2);
      let middleWritePayload = prePayload + hexWriteLength + writeDate;
      let crcWrite = getCrcString(middleWritePayload);
      return middleWritePayload + crcWrite;
  }
};

/**
 * Decimal modbusValue
 */

export const FunctionCodeEnum = {
  FUNCTION_ID_READ_COIL_STATUS: 1,
  FUNCTION_ID_READ_INPUT_STATUS: 2,
  FUNCTION_ID_READ_HOLDING_REGISTER: 3,
  FUNCTION_ID_READ_INPUT_REGISTER: 4,
  FUNCTION_ID_WRITE_SINGLE_COILS: 5,
  FUNCTION_ID_WRITE_SINGLE_REGISTER: 6,
  FUNCTION_ID_WRITE_MULTIPLE_COILS: 15,
  FUNCTION_ID_WRITE_MULTIPLE_REGISTER: 16,
};

const dec2Hex = (dec: Number, length: Number = -1) => {
  let hex = dec.toString(16);
  if (length === -1) {
    return hex;
  }
  while (hex.length < length) {
    `0${hex}`;
  }
  return hex;
};

const getCrcString = (payload: String) => {
  let intHex = [payload.length() / 2];
  for (let i = 0; i < intHex.length; i++) {
    intHex[i] = Number.parseInt(payload.substring(i * 2, i * 2 + 2), 16);
  }

  let checks: String = addZero(dec2bin(checkCrc(intHex)), 16);
  let srt_H: String = dec2Hex(Number.valueOf(checks.substring(0, 8), 2)); // High-Byte(8 bit)
  let crc_L: String = dec2Hex(
    Number.valueOf(checks.substring(checks.length() - 8, checks.length()), 2),
  );
  srt_H = srt_H.length() < 2 ? '0' + srt_H : srt_H;
  crc_L = crc_L.length() < 2 ? '0' + crc_L : crc_L;
  return crc_L + srt_H;
};

const dec2bin = dec => {
  return (dec >>> 0).toString(2);
};

const addZero = (sourceDate: String, formatLength: Number) => {
  let originalLen: Number = sourceDate.length();
  if (originalLen < formatLength) {
    for (let i = 0; i < formatLength - originalLen; i++) {
      sourceDate = '0' + sourceDate;
    }
  }
  return sourceDate;
};

const checkCrc = (buffer: []) => {
  let returnValue: Number = 0xffff;
  for (let i = 0; i < buffer.length; i++) {
    returnValue ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      if ((returnValue & 0x01) !== 0) {
        returnValue = (returnValue >> 1) ^ 0xa001;
      } else {
        returnValue = returnValue >> 1;
      }
    }
  }
  return returnValue;
};

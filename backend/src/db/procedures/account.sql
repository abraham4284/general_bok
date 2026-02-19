-- =========================
-- ACCOUNTS CRUD (MySQL 8+)
-- Table: accounts
-- =========================
-- Assumptions:
-- - Primary Key: idAccount (INT AUTO_INCREMENT)
-- - Soft delete via is_active (0/1)
-- - type: ENUM('CASH','BANK','WALLET','OTHER')
-- - currency: CHAR(3)
-- =========================

DELIMITER $$

-- ---------- CREATE ----------
DROP PROCEDURE IF EXISTS sp_accounts_create $$
CREATE PROCEDURE sp_accounts_create(
  IN  p_name      VARCHAR(80),
  IN  p_type      ENUM('CASH','BANK','WALLET','OTHER'),
  IN  p_currency  CHAR(3),
  IN  p_balance   DECIMAL(18,2),
  OUT p_idAccount INT
)
BEGIN
  DECLARE v_exists INT DEFAULT 0;

  IF p_name IS NULL OR TRIM(p_name) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Name is required';
  END IF;

  IF p_currency IS NULL OR CHAR_LENGTH(TRIM(p_currency)) <> 3 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Currency must be 3 characters (e.g. ARS)';
  END IF;

  IF p_balance IS NULL THEN
    SET p_balance = 0.00;
  END IF;

  SELECT COUNT(*)
    INTO v_exists
  FROM accounts
  WHERE name = p_name
  LIMIT 1;

  IF v_exists > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account name already exists';
  END IF;

  INSERT INTO accounts (name, type, currency, balance, is_active, created_at)
  VALUES (TRIM(p_name), p_type, UPPER(TRIM(p_currency)), p_balance, 1, NOW());

  SET p_idAccount = LAST_INSERT_ID();
END $$


-- ---------- READ (BY ID) ----------
DROP PROCEDURE IF EXISTS sp_accounts_get_by_id $$
CREATE PROCEDURE sp_accounts_get_by_id(
  IN p_idAccount INT
)
BEGIN
  SELECT
    idAccount,
    name,
    type,
    currency,
    balance,
    is_active,
    created_at
  FROM accounts
  WHERE idAccount = p_idAccount;
END $$


-- ---------- LIST (WITH OPTIONAL FILTERS) ----------
DROP PROCEDURE IF EXISTS sp_accounts_list $$
CREATE PROCEDURE sp_accounts_list(
  IN p_only_active TINYINT,                 -- 1 = only active, 0 = only inactive, NULL = all
  IN p_type ENUM('CASH','BANK','WALLET','OTHER'), -- NULL = all
  IN p_currency CHAR(3)                     -- NULL = all
)
BEGIN
  SELECT
    idAccount,
    name,
    type,
    currency,
    balance,
    is_active,
    created_at
  FROM accounts
  WHERE
    (p_only_active IS NULL OR is_active = p_only_active)
    AND (p_type IS NULL OR type = p_type)
    AND (p_currency IS NULL OR currency = UPPER(TRIM(p_currency)))
  ORDER BY is_active DESC, name ASC;
END $$

DROP PROCEDURE IF EXISTS sp_accounts_getAll $$
CREATE PROCEDURE sp_accounts_getAll()
BEGIN
 SELECT * FROM accounts;
END $$





-- ---------- UPDATE ----------
DROP PROCEDURE IF EXISTS sp_accounts_update $$
CREATE PROCEDURE sp_accounts_update(
  IN p_idAccount INT,
  IN p_name      VARCHAR(80),
  IN p_type      ENUM('CASH','BANK','WALLET','OTHER'),
  IN p_currency  CHAR(3),
  IN p_balance   DECIMAL(18,2),
  IN p_is_active TINYINT
)
BEGIN
  DECLARE v_exists INT DEFAULT 0;
  DECLARE v_count  INT DEFAULT 0;

  -- Ensure target exists
  SELECT COUNT(*)
    INTO v_count
  FROM accounts
  WHERE idAccount = p_idAccount;

  IF v_count = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account not found';
  END IF;

  -- Validate inputs (allow partial updates by passing NULL)
  IF p_name IS NOT NULL AND TRIM(p_name) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Name cannot be empty';
  END IF;

  IF p_currency IS NOT NULL AND CHAR_LENGTH(TRIM(p_currency)) <> 3 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Currency must be 3 characters (e.g. ARS)';
  END IF;

  IF p_is_active IS NOT NULL AND p_is_active NOT IN (0,1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'is_active must be 0 or 1';
  END IF;

  -- If name is changing, ensure uniqueness
  IF p_name IS NOT NULL THEN
    SELECT COUNT(*)
      INTO v_exists
    FROM accounts
    WHERE name = TRIM(p_name)
      AND idAccount <> p_idAccount
    LIMIT 1;

    IF v_exists > 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account name already exists';
    END IF;
  END IF;

  UPDATE accounts
  SET
    name      = COALESCE(TRIM(p_name), name),
    type      = COALESCE(p_type, type),
    currency  = COALESCE(UPPER(TRIM(p_currency)), currency),
    balance   = COALESCE(p_balance, balance),
    is_active = COALESCE(p_is_active, is_active)
  WHERE idAccount = p_idAccount;
END $$


-- ---------- SOFT DELETE (DEACTIVATE) ----------
DROP PROCEDURE IF EXISTS sp_accounts_deactivate $$
CREATE PROCEDURE sp_accounts_deactivate(
  IN p_idAccount INT
)
BEGIN
  UPDATE accounts
  SET is_active = 0
  WHERE idAccount = p_idAccount;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account not found';
  END IF;
END $$


-- ---------- ACTIVATE ----------
DROP PROCEDURE IF EXISTS sp_accounts_activate $$
CREATE PROCEDURE sp_accounts_activate(
  IN p_idAccount INT
)
BEGIN
  UPDATE accounts
  SET is_active = 1
  WHERE idAccount = p_idAccount;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account not found';
  END IF;
END $$


-- ---------- HARD DELETE (OPTIONAL) ----------
-- Use only if you are sure there are no related rows (e.g., GL lines).
DROP PROCEDURE IF EXISTS sp_accounts_delete $$
CREATE PROCEDURE sp_accounts_delete(
  IN p_idAccount INT
)
BEGIN
  DELETE FROM accounts
  WHERE idAccount = p_idAccount;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account not found';
  END IF;
END $$

DELIMITER ;

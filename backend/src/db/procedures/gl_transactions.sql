DELIMITER $$

-- ---------- CREATE ----------
DROP PROCEDURE IF EXISTS sp_gl_transactions_create $$
CREATE PROCEDURE sp_gl_transactions_create(
  IN  p_occurred_at VARCHAR(45),
  IN  p_description VARCHAR(255),
  IN  p_status      ENUM('POSTED','VOID'),
  IN  p_source      ENUM('MANUAL','SYSTEM','IMPORT'),
  IN  p_external_ref VARCHAR(120),
  OUT p_idGlTransaction INT
)
BEGIN
  IF p_occurred_at IS NULL THEN
    SET p_occurred_at = NOW();
  END IF;

  IF p_description IS NULL OR TRIM(p_description) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Description is required';
  END IF;

  IF p_status IS NULL THEN
    SET p_status = 'POSTED';
  END IF;

  IF p_source IS NULL THEN
    SET p_source = 'MANUAL';
  END IF;

  INSERT INTO gl_transactions (occurred_at, description, status, source, external_ref, created_at)
  VALUES (p_occurred_at, TRIM(p_description), p_status, p_source, p_external_ref, NOW());

  SET p_idGlTransaction = LAST_INSERT_ID();
END $$

-- ---------- READ (BY ID) ----------
DROP PROCEDURE IF EXISTS sp_gl_transactions_get_by_id $$
CREATE PROCEDURE sp_gl_transactions_get_by_id(
  IN p_idGlTransaction INT
)
BEGIN
  SELECT
    idGlTransaction,
    occurred_at,
    description,
    status,
    source,
    external_ref,
    created_at
  FROM gl_transactions
  WHERE idGlTransaction = p_idGlTransaction;
END $$

-- ---------- LIST ----------
DROP PROCEDURE IF EXISTS sp_gl_transactions_list $$
CREATE PROCEDURE sp_gl_transactions_list(
  IN p_status ENUM('POSTED','VOID'),
  IN p_source ENUM('MANUAL','SYSTEM','IMPORT'),
  IN p_date_from DATETIME,
  IN p_date_to   DATETIME
)
BEGIN
  SELECT
    idGlTransaction,
    occurred_at,
    description,
    status,
    source,
    external_ref,
    created_at
  FROM gl_transactions
  WHERE
    (p_status IS NULL OR status = p_status)
    AND (p_source IS NULL OR source = p_source)
    AND (p_date_from IS NULL OR occurred_at >= p_date_from)
    AND (p_date_to   IS NULL OR occurred_at <= p_date_to)
  ORDER BY occurred_at DESC, idGlTransaction DESC;
END $$


-- ---------- VOID ----------
DROP PROCEDURE IF EXISTS sp_gl_transactions_void $$
CREATE PROCEDURE sp_gl_transactions_void(
  IN p_idGlTransaction INT
)
BEGIN
  UPDATE gl_transactions
  SET status = 'VOID'
  WHERE idGlTransaction = p_idGlTransaction;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'GL transaction not found';
  END IF;
END $$

-- ---------- HARD DELETE (OPTIONAL) ----------
DROP PROCEDURE IF EXISTS sp_gl_transactions_delete $$
CREATE PROCEDURE sp_gl_transactions_delete(
  IN p_idGlTransaction INT
)
BEGIN
  DELETE FROM gl_transactions
  WHERE idGlTransaction = p_idGlTransaction;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'GL transaction not found';
  END IF;
END $$

DELIMITER ;
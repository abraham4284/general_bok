DELIMITER $$
DROP PROCEDURE IF EXISTS sp_gl_transaction_lines_create $$
CREATE PROCEDURE sp_gl_transaction_lines_create(
  IN  p_idGlTransaction INT,
  IN  p_idAccount       INT,
  IN  p_idAccountTo       INT,
  IN  p_idGlCategorie   INT,
  IN  p_amount          DECIMAL(18,2),
  IN  p_note            VARCHAR(255)
)
BEGIN
  DECLARE v_tx_exists INT DEFAULT 0;
  DECLARE v_acc_exists INT DEFAULT 0;
  DECLARE v_cat_exists INT DEFAULT 0;

  IF p_amount IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Amount must be non-zero';
  END IF;

  SELECT COUNT(*) INTO v_tx_exists
  FROM gl_transactions
  WHERE idGlTransaction = p_idGlTransaction;

  IF v_tx_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'GL transaction does not exist';
  END IF;

  SELECT COUNT(*) INTO v_acc_exists
  FROM accounts
  WHERE idAccount = p_idAccount;

  IF v_acc_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account does not exist';
  END IF;

  SELECT COUNT(*) INTO v_cat_exists
  FROM gl_categories
  WHERE idGlCategorie = p_idGlCategorie;

  IF v_cat_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'GL category does not exist';
  END IF;

  INSERT INTO gl_transaction_lines
    (idGlTransaction, idAccount, idAccountTo,idGlCategorie, amount, note, created_at)
  VALUES
    (p_idGlTransaction, p_idAccount,p_idAccountTo, p_idGlCategorie, p_amount, p_note, NOW());

END $$

-- ---------- READ (BY ID) ----------
DROP PROCEDURE IF EXISTS sp_gl_transaction_lines_get_by_transaction_id $$
CREATE PROCEDURE sp_gl_transaction_lines_get_by_transaction_id(
  IN p_idGlTransactionLine INT
)
BEGIN
 SELECT gtl.idGlTransactionLine, ac.name AS account_name , glc.name AS category_name , glc.nature, gtl.amount, gtl.created_at,  gtl.idAccount AS idAccount, gtl.idAccountTo AS idAccountTo
FROM gl_transaction_lines gtl
JOIN accounts ac ON ac.idAccount = gtl.idAccount
JOIN gl_categories glc ON glc.idGlCategorie = gtl.idGlCategorie
WHERE gtl.idGltransaction = p_idGlTransactionLine;
END $$

-- ---------- LIST BY TRANSACTION ----------
DROP PROCEDURE IF EXISTS sp_gl_transaction_lines_list_by_transaction $$
CREATE PROCEDURE sp_gl_transaction_lines_list_by_transaction(
  IN p_idGlTransaction INT
)
BEGIN
  SELECT
    idGlTransactionLine,
    idGlTransaction,
    idAccount,
    idGlCategorie,
    amount,
    note,
    created_at
  FROM gl_transaction_lines
  WHERE idGlTransaction = p_idGlTransaction
  ORDER BY idGlTransactionLine ASC;
END $$



-- ---------- DELETE ----------
DROP PROCEDURE IF EXISTS sp_gl_transaction_lines_delete $$
CREATE PROCEDURE sp_gl_transaction_lines_delete(
  IN p_idGlTransactionLine INT
)
BEGIN
  DELETE FROM gl_transaction_lines
  WHERE idGlTransactionLine = p_idGlTransactionLine;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'GL transaction line not found';
  END IF;
END $$

DELIMITER ;